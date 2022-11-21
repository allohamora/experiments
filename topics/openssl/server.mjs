import { readFile } from 'node:fs/promises';
import { createServer } from 'node:https';

const options = {
  key: await readFile('temp/private-key.pem'),
  cert: await readFile('temp/localhost.crt'),
};

const PORT = 3000;

createServer(options, (req, res) => {
  res.writeHead(200, 'OK');
  res.end('Hello World!');
}).listen(PORT, () => console.log(`Server started at port: ${PORT}`));