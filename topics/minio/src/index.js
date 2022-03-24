import { createReadStream } from 'node:fs';
import { createServer, logging, routing, HttpCode, HttpType, HttpMessage } from './http.js';
import { publicFilePath } from './path.js';
import { parseForm } from './parse-form.js';

const { PORT = 3000 } = process.env;

const routes = {
  'GET:/': ({ res }) => {
    const readStream = createReadStream(publicFilePath('index.html'));

    res.statusCode = HttpCode.Ok;
    res.setHeader('Content-Type', HttpType.Html);
    readStream.pipe(res);
  },
  'POST:/file': async ({ req, reply }) => {
    const form = await parseForm(req);

    console.log(form);

    reply({ status: HttpCode.Ok, message: HttpMessage.Ok });
  },
};

const server = createServer({
  port: PORT,
  middlewares: [logging, routing(routes)],
});

server.listen();
