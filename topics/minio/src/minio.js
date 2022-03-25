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
