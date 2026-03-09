import { expandGlob } from "jsr:@std/fs/expand-glob";
import { dirname, join } from "jsr:@std/path";
import sharp from "npm:sharp@0.33.2";

const mediaDir = "src/static/media/";

async function compressWebP() {
  console.log("Starting WebP re-compression to quality 80...");
  let compressedCount = 0;

  // Find all .webp files in src/static/media/
  for await (const entry of expandGlob("**/*.webp", { root: mediaDir })) {
    if (!entry.isFile) continue;

    // We can't overwrite the file we're currently reading from,
    // so we save to a temporary file first.
    const tempPath = join(dirname(entry.path), `temp_${entry.name}`);

    try {
      console.log(`Compressing: ${entry.name}`);
      
      // Re-compress the webp image
      await sharp(entry.path)
        .webp({ quality: 80, force: true }) // Re-encode WebP with quality 80
        .toFile(tempPath);

      // Overwrite the original file with the compressed one
      await Deno.rename(tempPath, entry.path);
      
      compressedCount++;
    } catch (error) {
      console.error(`Error compressing ${entry.name}:`, error);
      
      // Attempt to clean up temp file if something went wrong
      try {
        await Deno.remove(tempPath);
      } catch (_) {
        // Ignore cleanup errors
      }
    }
  }

  console.log(`\nFinished compressing ${compressedCount} WebP images.`);
}

if (import.meta.main) {
  await compressWebP();
  console.log("Done.");
}
