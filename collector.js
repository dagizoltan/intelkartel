import { expandGlob } from "jsr:@std/fs/expand-glob";
import { dirname, join, basename, extname } from "jsr:@std/path";
import { ensureDir } from "jsr:@std/fs/ensure-dir";

// Define the source directory containing the markdown articles
const articlesDir = "data/";
const mediaDestDir = "src/media/";

// Define the domain to look for - matching intelkartel.com as found in files
const targetDomainRegex = /https?:\/\/(?:www\.)?intelkartel\.com[^\s"'>)]+/gi;

// Supported media extensions
const mediaExtensions = new Set([
  ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg",
  ".mp4", ".webm", ".ogg",
  ".mp3", ".wav", ".flac", ".aac"
]);

async function downloadFile(url, destPath) {
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

async function processArticles() {
  const collectedLinks = [];

  // Iterate over all .md files in the data directory
  for await (const entry of expandGlob("**/*.md", { root: articlesDir })) {
    if (!entry.isFile) continue;

    let articleContent = await Deno.readTextFile(entry.path);
    const articleName = basename(entry.name, ".md");
    
    // Find all matching URLs in the article
    const matches = articleContent.match(targetDomainRegex);
    
    if (matches && matches.length > 0) {
      // Filter unique URLs to avoid downloading duplicates multiple times
      const uniqueUrls = [...new Set(matches)].filter(url => {
        // Skip youtube just in case
        if (url.includes("youtube.com") || url.includes("youtu.be")) {
          return false;
        }
        
        try {
          // clean URL from trailing stuff like query params to check extension
          const urlObj = new URL(url.replace(/&amp;/g, '&'));
          const ext = extname(urlObj.pathname).toLowerCase();
          return mediaExtensions.has(ext) || urlObj.pathname.includes("/wp-content/uploads/");
        } catch (e) {
          return false;
        }
      });

      if (uniqueUrls.length > 0) {
        console.log(`Processing ${entry.name} - found ${uniqueUrls.length} media links`);
        
        const articleMediaDir = join(mediaDestDir, articleName);
        await ensureDir(articleMediaDir);
        
        let updatedContent = articleContent;
        let fileUpdated = false;
        
        for (const url of uniqueUrls) {
          collectedLinks.push({ article: entry.name, url });
          
          try {
            // Unescape HTML entities like &amp; in the URL before fetching
            const unescapedUrl = url.replace(/&amp;/g, '&');
            const parsedUrl = new URL(unescapedUrl);
            
            // Get the filename from the URL, or default to a safe name
            let filename = basename(parsedUrl.pathname);
            if (!filename) {
              filename = "index.html";
            }
            // Decode URL-encoded characters in filename
            filename = decodeURIComponent(filename);

            const destPath = join(articleMediaDir, filename);
            
            console.log(`  Downloading ${unescapedUrl} to ${destPath}...`);
            // Actually download the file
            const success = await downloadFile(unescapedUrl, destPath);
            
            if (success) {
              // Replace the original URL in the content with the new web path
              const newWebPath = `/media/${articleName}/${filename}`;
              // Use split/join to replace all occurrences without regex escaping issues
              updatedContent = updatedContent.split(url).join(newWebPath);
              fileUpdated = true;
            }
          } catch (e) {
             console.error(`Error processing URL ${url}:`, e);
          }
        }
        
        if (fileUpdated) {
          await Deno.writeTextFile(entry.path, updatedContent);
          console.log(`  Updated ${entry.name} with local media paths.`);
        }
      }
    }
  }

  // Save the collected links to a file in the root
  await Deno.writeTextFile("collected_media_links.json", JSON.stringify(collectedLinks, null, 2));
  console.log(`\nCollected ${collectedLinks.length} media links across all articles.`);
  console.log("Saved collected links to collected_media_links.json");
}

if (import.meta.main) {
  console.log("Starting media collection and processing...");
  await processArticles();
  console.log("Done.");
}
