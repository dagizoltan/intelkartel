import { ensureDir } from "jsr:@std/fs/ensure-dir";
import { join, basename, extname } from "jsr:@std/path";

const TARGET_URL = "https://intelkartel.com/";
const OUTPUT_DIR = "music";
const MUSIC_EXTENSIONS = new Set([".mp3", ".wav", ".flac", ".aac", ".ogg"]);

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

async function scrapeMusic(): Promise<void> {
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

  // More robust regex to find href and src attributes
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
      // Decode HTML entities like &amp;
      const unescapedUrl = url.replace(/&amp;/g, "&");

      // Resolve against base URL to handle relative paths
      const urlObj = new URL(unescapedUrl, TARGET_URL);
      const ext = extname(urlObj.pathname).toLowerCase();
      return MUSIC_EXTENSIONS.has(ext);
    } catch {
      return false;
    }
  }).map((url) => {
      // Return absolute URLs
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

    try {
      await Deno.stat(destPath);
      console.log(`[${i + 1}/${uniqueUrls.length}] Skip (exists): ${filename}`);
      continue;
    } catch {
      // File doesn't exist, proceed with download
    }

    console.log(`[${i + 1}/${uniqueUrls.length}] Downloading: ${unescapedUrl} -> ${destPath}`);
    const success = await downloadFile(unescapedUrl, destPath);
    if (success) {
      console.log(`  -> Successfully downloaded ${filename}`);
    } else {
      console.log(`  -> Failed to download ${filename}`);
    }
  }

  console.log("Scraping complete.");
}

if (import.meta.main) {
  await scrapeMusic();
}
