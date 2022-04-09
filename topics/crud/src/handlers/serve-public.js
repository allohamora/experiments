import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isNotExists } from '../utils/fs.js';
import { StatusCode, ContentType, Message } from '../utils/http.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const capitalize = (string) => `${string[0].toUpperCase()}${string.slice(1)}`;

export const servePublic = ({ router }) => {
  router.get('/:filePath', async ({ res, params: { filePath } }) => {
    const file = filePath || 'index.html';
    const ext = path.extname(file).replace('.', '');

    const notFound = () => {
      res.statusCode = StatusCode.NotFound;
      res.setHeader('Content-Type', ContentType.Text);
      res.end(Message.NotFound);
    };

    if (!ext) {
      notFound();
      return;
    }

    const contentTypeKey = capitalize(ext);
    const contentType = ContentType[contentTypeKey] ?? ContentType.Text;

    const fullFilePath = path.join(__dirname, '..', 'public', file);

    if (await isNotExists(fullFilePath)) {
      notFound();
      return;
    }

    res.statusCode = StatusCode.Ok;
    res.setHeader('Content-Type', contentType);
    fs.createReadStream(fullFilePath).pipe(res);
  });
};
