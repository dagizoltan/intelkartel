import { expandGlob } from "jsr:@std/fs/expand-glob";
import { join } from "jsr:@std/path";

const originalDir = "data/music-original";
const targetDir = "data/music";

async function compressMusic() {
  console.log("Starting music compression...");

  try {
    await Deno.mkdir(targetDir, { recursive: true });
  } catch (error) {
    if (!(error instanceof Deno.errors.AlreadyExists)) {
      console.error(`Failed to create target directory ${targetDir}:`, error);
      return;
    }
  }

  try {
    const originalInfo = await Deno.stat(originalDir);
    if (!originalInfo.isDirectory) {
      console.error(`Error: ${originalDir} is not a directory.`);
      return;
    }
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      console.error(`Error: Original directory ${originalDir} not found.`);
    } else {
      console.error(`Error accessing ${originalDir}:`, error);
    }
    return;
  }

  let compressedCount = 0;
  let fileCount = 0;

  try {
    for await (const entry of expandGlob("**/*.mp3", { root: originalDir })) {
      if (!entry.isFile) continue;

      fileCount++;

      const targetPath = join(targetDir, entry.name);

      console.log(`Compressing: ${entry.name}`);

      try {
        const command = new Deno.Command("ffmpeg", {
          args: [
            "-y",
            "-i", entry.path,
            "-codec:a", "libmp3lame",
            "-b:a", "64k",
            targetPath
          ],
          stdout: "null",
          stderr: "inherit",
        });

        const { code } = await command.output();

        if (code !== 0) {
          console.error(`Error compressing ${entry.name}: ffmpeg exited with code ${code}`);
        } else {
          compressedCount++;
          console.log(`Successfully compressed ${entry.name}`);
        }
      } catch (error) {
        console.error(`Error executing ffmpeg for ${entry.name}:`, error);
      }
    }

    if (fileCount === 0) {
      console.log("No .mp3 files found to compress.");
    } else {
      console.log(`\nFinished compressing ${compressedCount} out of ${fileCount} audio files.`);
    }

  } catch (error) {
    console.error('Error expanding glob in original directory:', error);
  }
}

if (import.meta.main) {
  await compressMusic();
}
