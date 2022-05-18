import { createServer } from 'node:http';
import { setTimeout as delay } from 'node:timers/promises';

const PORT = 3000;

const server = createServer(async (req, res) => {
  console.log('before');

  await delay(5000);

  res.writeHead(200, 'OK');
  res.end('hello world!');

  console.log('after');
});

server.listen(PORT, () => console.log(`server started at ${PORT} port`));
