import { Client } from 'minio';

const { MINIO_ROOT_USER, MINIO_ROOT_PASSWORD, MINIO_ENDPOINT, MINIO_PORT, MINIO_USE_SSL } = process.env;

export const minioClient = new Client({
  endPoint: MINIO_ENDPOINT,
  port: parseInt(MINIO_PORT),
  accessKey: MINIO_ROOT_USER,
  secretKey: MINIO_ROOT_PASSWORD,
  useSSL: MINIO_USE_SSL === 'true' ? true : false,
});

export const UPLOAD_BUCKET = 'minio.topic';
export const UPLOAD_REGION = 'eu-central-1';

export const publicReadPolicy = (bucket) =>
  JSON.stringify({
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'PublicRead',
        Effect: 'Allow',
        Principal: '*',
        Action: ['s3:GetObject', 's3:GetObjectVersion'],
        Resource: [`arn:aws:s3:::${bucket}/*`],
      },
    ],
  });

export const getPublicDownloadUrl = (bucket, filename) => `${MINIO_ENDPOINT}:${MINIO_PORT}/${bucket}/${filename}`;
