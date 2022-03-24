import busboy from 'busboy';
import { createWriteStream } from 'node:fs';
import { uploadFilePath } from './path.js';

export const parseForm = (req) =>
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
      const { filename } = info;
      const filePath = uploadFilePath(filename);
      const writeStream = createWriteStream(filePath);

      form[name] = {
        ...info,
        filePath,
        type: 'file',
      };

      stream.pipe(writeStream);
    });

    bb.on('error', (error) => rej(error));
    bb.on('close', () => res(form));

    req.pipe(bb);
  });
