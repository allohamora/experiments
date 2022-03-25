import { createReadStream } from 'node:fs';
import { createServer, logging, routing, HttpCode, HttpType, HttpMessage } from './http.js';
import { publicFilePath, uploadFilePath } from './path.js';
import { minioUploadStrategy, parseForm } from './parse-form.js';
import { isExists } from './fs.js';
import { minioClient } from './minio.js';

const { PORT = 3000 } = process.env;

const routes = {
  'POST:/file': async ({ req, reply }) => {
    const { file } = await parseForm(req, minioUploadStrategy);

    reply({ status: HttpCode.Ok, data: JSON.stringify(file) });
  },
  'GET:/static/file/.+': async ({ req, res, reply }) => {
    const file = req.url.replace('/static/file/', '');
    const filePath = uploadFilePath(file);
    const isFileExists = await isExists(filePath);

    if (!isFileExists) {
      reply({ status: HttpCode.NotFound, data: HttpMessage.NotFound });
      return;
    }

    const readStream = createReadStream(filePath);

    res.statusCode = 200;
    readStream.pipe(res);
  },
  'GET:/minio/file/.+': async ({ req, res, reply }) => {
    const [bucket, file] = req.url.replace('/minio/file/', '').split('/');
    const notFound = () => reply({ status: HttpCode.NotFound, data: HttpMessage.NotFound });

    if (!bucket || !file) {
      notFound();
      return;
    }

    try {
      const stream = await minioClient.getObject(bucket, file);

      res.statusCode = 200;
      stream.pipe(res);
    } catch (error) {
      notFound();
    }
  },
  'GET:/': ({ res }) => {
    const readStream = createReadStream(publicFilePath('index.html'));

    res.statusCode = HttpCode.Ok;
    res.setHeader('Content-Type', HttpType.Html);
    readStream.pipe(res);
  },
};

const server = createServer({
  port: PORT,
  middlewares: [logging, routing(routes)],
});

server.listen();
