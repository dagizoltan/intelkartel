import { ensureDir } from "jsr:@std/fs/ensure-dir";
import { join, basename, extname } from "jsr:@std/path";
import { S3Client, PutObjectCommand } from "npm:@aws-sdk/client-s3";

const TARGET_URL = "https://intelkartel.com/";
const OUTPUT_DIR = "data/music";
const MUSIC_EXTENSIONS = new Set([".mp3", ".wav", ".flac", ".aac", ".ogg"]);
console.log(Deno.env.get("R2_ENDPOINT"), Deno.env.get("R2_ACCESS_KEY_ID"), Deno.env.get("R2_SECRET_ACCESS_KEY"), Deno.env.get("R2_BUCKET_NAME"));   
const s3Client = new S3Client({
  region: "auto",
  endpoint: Deno.env.get("R2_ENDPOINT") || "http://localhost:9000",
  credentials: {
    accessKeyId: Deno.env.get("R2_ACCESS_KEY_ID") || "minioadmin",
    secretAccessKey: Deno.env.get("R2_SECRET_ACCESS_KEY") || "minioadmin",
  },
  forcePathStyle: true,
});
const BUCKET_NAME = Deno.env.get("R2_BUCKET_NAME") || "intelkartel-media";

async function downloadFile(url: string, destPath: string): Promise<boolean> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to download ${url}: ${response.status} ${response.statusText}`);
      return false;
    }
    const fileData = new Uint8Array(await response.arrayBuffer());
    await Deno.writeFile(destPath, fileData);
    return true;
  } catch (error) {
    console.error(`Error downloading ${url}:`, error);
    return false;
  }
}

async function uploadToBucket(filename: string, destPath: string) {
  try {
    const fileData = await Deno.readFile(destPath);
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `audio/${filename}`,
      Body: fileData,
    });
    await s3Client.send(command);
    console.log(`  -> Successfully uploaded ${filename} to bucket`);
  } catch (err) {
    console.error(`  -> Error uploading ${filename} to bucket:`, err);
  }
}

async function scrapeAndUpload(): Promise<void> {
  await ensureDir(OUTPUT_DIR);

  console.log(`Fetching homepage: ${TARGET_URL}`);
  let html = "";
  try {
    const response = await fetch(TARGET_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    html = await response.text();
  } catch (error) {
    console.error("Failed to fetch homepage:", error);
    return;
  }

  const urlRegex = /(?:href|src)=["']([^"']+)["']/gi;
  const matches: string[] = [];
  let match;
  while ((match = urlRegex.exec(html)) !== null) {
    if (match[1]) {
      matches.push(match[1]);
    }
  }

  const uniqueUrls = [...new Set(matches)].filter((url) => {
    try {
      const unescapedUrl = url.replace(/&amp;/g, "&");
      const urlObj = new URL(unescapedUrl, TARGET_URL);
      const ext = extname(urlObj.pathname).toLowerCase();
      return MUSIC_EXTENSIONS.has(ext);
    } catch {
      return false;
    }
  }).map((url) => {
      return new URL(url.replace(/&amp;/g, "&"), TARGET_URL).toString();
  });

  console.log(`Found ${uniqueUrls.length} unique music URLs.`);

  for (let i = 0; i < uniqueUrls.length; i++) {
    const rawUrl = uniqueUrls[i];
    const unescapedUrl = rawUrl.replace(/&amp;/g, "&");

    let filename = "";
    try {
      const parsedUrl = new URL(unescapedUrl);
      filename = basename(parsedUrl.pathname);
      filename = decodeURIComponent(filename);
    } catch {
      filename = `audio_${i}.mp3`;
    }

    if (!filename) {
      filename = `audio_${i}.mp3`;
    }

    const destPath = join(OUTPUT_DIR, filename);

    let existsLocally = false;
    try {
      await Deno.stat(destPath);
      existsLocally = true;
      console.log(`[${i + 1}/${uniqueUrls.length}] Local file exists: ${filename}`);
    } catch {
      // File doesn't exist locally
    }

    if (!existsLocally) {
      console.log(`[${i + 1}/${uniqueUrls.length}] Downloading: ${unescapedUrl} -> ${destPath}`);
      const success = await downloadFile(unescapedUrl, destPath);
      if (!success) {
        continue;
      }
    }

    // Upload the downloaded file to S3 bucket
    console.log(`[${i + 1}/${uniqueUrls.length}] Uploading to bucket: audio/${filename}`);
    await uploadToBucket(filename, destPath);
  }

  console.log("Scraping and uploading complete.");
}

if (import.meta.main) {
  await scrapeAndUpload();
}
