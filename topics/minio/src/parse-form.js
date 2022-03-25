import busboy from 'busboy';
import { createWriteStream } from 'node:fs';
import { uploadFilePath } from './path.js';
import { getPublicDownloadUrl, minioClient, publicReadPolicy, UPLOAD_BUCKET, UPLOAD_REGION } from './minio.js';

export const staticUploadStrategy = {
  fileHandler: (name, stream, info) => {
    const { filename } = info;
    const filePath = uploadFilePath(filename);
    const writeStream = createWriteStream(filePath);
    const url = `/static/file/${filename}`;

    stream.pipe(writeStream);

    return {
      ...info,
      url,
    };
  },
};

export const minioUploadStrategy = {
  fileHandler: async (name, stream, info) => {
    const { filename } = info;
    const isBucketExists = await minioClient.bucketExists(UPLOAD_BUCKET);

    if (!isBucketExists) {
      await minioClient.makeBucket(UPLOAD_BUCKET, UPLOAD_REGION);
      await minioClient.setBucketPolicy(UPLOAD_BUCKET, publicReadPolicy(UPLOAD_BUCKET));
    }

    const url = getPublicDownloadUrl(UPLOAD_BUCKET, filename);

    minioClient.putObject(UPLOAD_BUCKET, filename, stream);

    return {
      ...info,
      url,
    };
  },
};

export const parseForm = (req, strategy = staticUploadStrategy) =>
  new Promise((res, rej) => {
    const bb = busboy({ headers: req.headers });
    const form = {};

    bb.on('field', (name, value, info) => {
      form[name] = {
        ...info,
        value,
        type: 'field',
      };
    });

    bb.on('file', async (name, stream, info) => {
      const file = await strategy.fileHandler(name, stream, info);

      form[name] = { ...file, type: 'file' };
    });

    bb.on('error', (error) => rej(error));
    bb.on('close', () => res(form));

    req.pipe(bb);
  });
