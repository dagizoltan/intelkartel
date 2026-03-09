import { expandGlob } from "jsr:@std/fs/expand-glob";
import { dirname, join, basename, extname } from "jsr:@std/path";
import sharp from "npm:sharp@0.33.2";

const mediaDir = "src/static/media/";
const articlesDir = "data/";

async function processImages() {
  const convertedFiles = new Map(); // Store original -> new filename mappings

  console.log("Starting image conversion to WebP...");

  // 1. Find and convert all .jpg, .jpeg, and .png files in src/static/media/
  for await (const entry of expandGlob("**/*.{jpg,jpeg,png,JPG,JPEG,PNG}", { root: mediaDir })) {
    if (!entry.isFile) continue;

    const originalExt = extname(entry.name);
    const filenameWithoutExt = basename(entry.name, originalExt);
    const newFilename = `${filenameWithoutExt}.webp`;
    const newPath = join(dirname(entry.path), newFilename);

    try {
      console.log(`Converting: ${entry.name} -> ${newFilename}`);
      
      // Convert the image to webp
      await sharp(entry.path)
        .webp({ quality: 100 }) // Adjust quality as needed
        .toFile(newPath);

      // Record the change so we can update the markdown files
      convertedFiles.set(entry.name, newFilename);

      // Delete the original file
      await Deno.remove(entry.path);
      console.log(`  Deleted original: ${entry.name}`);

    } catch (error) {
      console.error(`Error processing ${entry.name}:`, error);
    }
  }

  console.log(`\nConverted ${convertedFiles.size} images to WebP.`);
  
  if (convertedFiles.size === 0) {
    console.log("No images found to convert.");
    return;
  }

  console.log("\nUpdating references in markdown files...");

  // 2. Update all .md files in data/ to reflect the new .webp extensions
  let updatedArticlesCount = 0;

  for await (const entry of expandGlob("**/*.md", { root: articlesDir })) {
    if (!entry.isFile) continue;

    let content = await Deno.readTextFile(entry.path);
    let fileModified = false;

    // Iterate through our map of converted files and replace occurrences
    for (const [oldName, newName] of convertedFiles) {
      // Check if the old filename exists in the markdown file
      if (content.includes(oldName)) {
        // Replace all occurrences of the old filename with the new .webp filename
        // Using split/join to replace all occurrences securely
        content = content.split(oldName).join(newName);
        fileModified = true;
      }
    }

    if (fileModified) {
      await Deno.writeTextFile(entry.path, content);
      console.log(`Updated references in: ${entry.name}`);
      updatedArticlesCount++;
    }
  }

  console.log(`\nFinished updating ${updatedArticlesCount} markdown files.`);
}

if (import.meta.main) {
  await processImages();
  console.log("Done.");
}
