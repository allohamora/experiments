import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { StatusCode, ContentType } from '../utils/http.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const capitalize = (string) => `${string[0].toUpperCase()}${string.slice(1)}`;

export const servePublic = ({ router }) => {
  router.get('/:filePath', async ({ res, params: { filePath } }) => {
    const file = filePath || 'index.html';
    const ext = path.extname(file).replace('.', '');
    const contentTypeKey = capitalize(ext);

    res.statusCode = StatusCode.Ok;
    res.setHeader('Content-Type', ContentType[contentTypeKey]);
    fs.createReadStream(path.join(__dirname, '..', 'public', file)).pipe(res);
  });
};
