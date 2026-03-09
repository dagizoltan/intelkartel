export async function scanMediaFiles() {
  const rootDir = './src/interface/web/static/media';

  const files = {
    images: [],
    audio: [],
    pdfs: []
  };

  const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const audioExts = ['.mp3', '.wav', '.ogg', '.m4a', '.aac'];
  const pdfExts = ['.pdf'];

  async function walkDir(dir) {
    try {
      for await (const dirEntry of Deno.readDir(dir)) {
        const path = `${dir}/${dirEntry.name}`;

        if (dirEntry.isDirectory) {
          await walkDir(path);
        } else if (dirEntry.isFile) {
          const lowerName = dirEntry.name.toLowerCase();

          // Get extension
          const lastDotIndex = lowerName.lastIndexOf('.');
          if (lastDotIndex === -1) continue;

          const ext = lowerName.substring(lastDotIndex);

          // Construct URL path
          // From ./src/interface/web/static/media/folder/file.ext
          // to /static/media/folder/file.ext
          const urlPath = path.replace('./src/interface/web', '');

          const fileObj = {
            name: dirEntry.name,
            url: urlPath,
            path: path
          };

          if (imageExts.includes(ext)) {
            files.images.push(fileObj);
          } else if (audioExts.includes(ext)) {
            files.audio.push(fileObj);
          } else if (pdfExts.includes(ext)) {
            files.pdfs.push(fileObj);
          }
        }
      }
    } catch (err) {
      console.error(`Error scanning directory ${dir}:`, err);
    }
  }

  await walkDir(rootDir);

  // Sort files by name for consistency
  const sortFn = (a, b) => a.name.localeCompare(b.name);
  files.images.sort(sortFn);
  files.audio.sort(sortFn);
  files.pdfs.sort(sortFn);

  return files;
}
