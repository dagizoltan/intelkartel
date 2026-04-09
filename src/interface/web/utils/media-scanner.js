import { S3Client, ListObjectsV2Command } from "npm:@aws-sdk/client-s3";

let s3ClientInstance = null;
const getS3Client = () => {
  if (!s3ClientInstance) {
    s3ClientInstance = new S3Client({

    region: "auto",
    endpoint: Deno.env.get("R2_ENDPOINT"),
    credentials: {
      accessKeyId: Deno.env.get("R2_ACCESS_KEY_ID"),
      secretAccessKey: Deno.env.get("SECRET_ACCESS_KEY"),
    },
      forcePathStyle: true,
    });
  }
  return s3ClientInstance;
};

export async function scanMediaFiles() {
  const s3 = getS3Client();
  const bucketName = Deno.env.get("R2_BUCKET_NAME");

  const files = {
    images: [],
    audio: [],
    pdfs: []
  };

  const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const audioExts = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac'];
  const pdfExts = ['.pdf'];

  try {
    let isTruncated = true;
    let continuationToken;

    while (isTruncated) {
      const command = new ListObjectsV2Command({
        Bucket: bucketName,
        ContinuationToken: continuationToken
      });

      const response = await s3.send(command);

      if (response.Contents) {
        for (const item of response.Contents) {
          const key = item.Key; // e.g., "my-folder/my-file.jpg"
          if (!key) continue;

          const lowerName = key.toLowerCase();
          const lastDotIndex = lowerName.lastIndexOf('.');
          if (lastDotIndex === -1) continue;

          const ext = lowerName.substring(lastDotIndex);
          // the name should just be the base filename without the path
          const name = key.split('/').pop();

          // url path matching what proxy expects
          const urlPath = `/static/media/${key}`;

          const fileObj = {
            name: name,
            url: urlPath,
            path: key // can just be key
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

      isTruncated = response.IsTruncated;
      continuationToken = response.NextContinuationToken;
    }
  } catch (error) {
    console.error("Error scanning S3 bucket:", error);
  }

  // Fallback: still scan local music directory
  const musicDir = './data/music';
  try {
    async function walkDir(dir) {
      for await (const dirEntry of Deno.readDir(dir)) {
        const path = `${dir}/${dirEntry.name}`;
        if (dirEntry.isDirectory) {
          await walkDir(path);
        } else if (dirEntry.isFile) {
          const lowerName = dirEntry.name.toLowerCase();
          const lastDotIndex = lowerName.lastIndexOf('.');
          if (lastDotIndex === -1) continue;
          const ext = lowerName.substring(lastDotIndex);

          let urlPath = path;
          if (path.startsWith('./data/music')) {
            urlPath = path.substring(1); // removes '.' -> /data/music/...
          }

          const fileObj = {
            name: dirEntry.name,
            url: urlPath,
            path: path
          };
          if (imageExts.includes(ext)) files.images.push(fileObj);
          else if (audioExts.includes(ext)) files.audio.push(fileObj);
          else if (pdfExts.includes(ext)) files.pdfs.push(fileObj);
        }
      }
    }
    await walkDir(musicDir);
  } catch (err) {
    if (err.name !== 'NotFound') {
      console.error(`Error scanning directory ${musicDir}:`, err);
    }
  }

  // Sort files by name for consistency
  const sortFn = (a, b) => a.name.localeCompare(b.name);
  files.images.sort(sortFn);
  files.audio.sort(sortFn);
  files.pdfs.sort(sortFn);

  return files;
}
