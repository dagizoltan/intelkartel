export async function scanMediaFiles() {
  const rootDir = './src/interface/web/static/media';
  const musicDir = './data/music';

  const files = {
    images: [],
    audio: [],
    pdfs: []
  };

  const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const audioExts = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac'];
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
          let urlPath = path;
          if (path.startsWith('./src/interface/web')) {
            urlPath = path.replace('./src/interface/web', '');
          } else if (path.startsWith('./data/music')) {
            urlPath = path.substring(1); // removes '.' -> /data/music/...
          }

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
      if (err.name !== 'NotFound') {
        console.error(`Error scanning directory ${dir}:`, err);
      }
    }
  }

  await walkDir(rootDir);
  await walkDir(musicDir);

  // Sort files by name for consistency
  const sortFn = (a, b) => a.name.localeCompare(b.name);
  files.images.sort(sortFn);
  files.audio.sort(sortFn);
  files.pdfs.sort(sortFn);

  return files;
}
