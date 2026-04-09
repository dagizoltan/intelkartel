import { S3Client, GetObjectCommand } from "npm:@aws-sdk/client-s3";

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

export const s3ProxyHandler = async (c) => {
  const s3 = getS3Client();
  const bucketName = Deno.env.get("R2_BUCKET_NAME");

  // Clean the path so it works with S3
  // c.req.path will be `/static/media/foo/bar.jpg`.
  // We need to extract the key by removing `/static/media/`
  const prefix = '/static/media/';
  let key = c.req.path;
  if (key.startsWith(prefix)) {
    key = key.substring(prefix.length);
  }

  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const response = await s3.send(command);

    if (response.Body) {
      const headers = new Headers();
      if (response.ContentType) headers.set('Content-Type', response.ContentType);
      if (response.ContentLength) headers.set('Content-Length', response.ContentLength.toString());
      if (response.ETag) headers.set('ETag', response.ETag);
      if (response.CacheControl) headers.set('Cache-Control', response.CacheControl);

      // We must convert the stream correctly for Deno/Hono
      return new Response(response.Body.transformToWebStream(), {
        status: 200,
        headers,
      });
    } else {
      return c.notFound();
    }
  } catch (error) {
    if (error.name === 'NoSuchKey') {
      return c.notFound();
    }
    console.error(`S3 proxy error for key ${key}:`, error);
    return c.text('Internal Server Error', 500);
  }
};
