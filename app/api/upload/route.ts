import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Initialize S3 Client for Cloudflare R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const hotelId = formData.get('hotelId') as string | null;
    const uploadType = formData.get('uploadType') as string | null;

    if (!file || !hotelId || !uploadType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Clean and sanitize filename
    const originalName = file.name;
    const extension = originalName.substring(originalName.lastIndexOf('.')).toLowerCase();
    const baseName = originalName.substring(0, originalName.lastIndexOf('.'));
    const sanitizedBase = baseName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    
    const timestamp = Date.now();
    const objectKey = `hotels/${hotelId}/${uploadType}/${sanitizedBase}-${timestamp}${extension}`;

    const contentType = file.type || 'application/octet-stream';

    // Extract bucket name from R2_ENDPOINT if necessary, but typically R2 requires the bucket name in the command
    // Wait, Cloudflare R2 endpoint does not contain the bucket name usually, it is just `https://<account_id>.r2.cloudflarestorage.com`
    // We should probably read R2_BUCKET_NAME from environment. But the prompt doesn't explicitly mention R2_BUCKET_NAME,
    // let's assume R2_BUCKET_NAME is available or we can extract it if needed.
    // Actually, let's use `process.env.R2_BUCKET_NAME` as it's standard, and I'll add a fallback just in case.
    const bucketName = process.env.R2_BUCKET_NAME;

    if (!bucketName) {
      return NextResponse.json({ error: 'Missing R2_BUCKET_NAME environment variable' }, { status: 500 });
    }

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
        Body: buffer,
        ContentType: contentType,
      })
    );

    const publicUrl = `${process.env.R2_PUBLIC_BUCKET_URL}/${objectKey}`;

    return NextResponse.json({ url: publicUrl }, { status: 200 });
  } catch (error) {
    console.error('Error uploading to R2:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
