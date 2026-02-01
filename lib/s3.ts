import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export async function uploadToR2(
  buffer: Buffer,
  fileName: string,
  contentType: string
) {
  const bucketName = process.env.R2_BUCKET_NAME;
  const publicUrl = process.env.R2_PUBLIC_URL;

  if (!bucketName) {
    throw new Error("R2_BUCKET_NAME is not defined");
  }

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: contentType,
    })
  );

  // Return the public URL for the uploaded file
  return `${publicUrl}/${fileName}`;
}

export async function uploadBase64ToR2(
  base64String: string,
  fileNamePrefix: string
) {
  // Extract content type and base64 data
  const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    // If it's already a URL, return as is
    if (base64String.startsWith("http")) return base64String;
    throw new Error("Invalid base64 string");
  }

  const contentType = matches[1];
  const buffer = Buffer.from(matches[2], "base64");
  const extension = contentType.split("/")[1] || "jpg";
  const fileName = `${fileNamePrefix}-${Date.now()}.${extension}`;

  return uploadToR2(buffer, fileName, contentType);
}
