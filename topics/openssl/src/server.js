import { readFile } from 'node:fs/promises';
import { createServer } from 'node:https';

const options = {
  key: await readFile('temp/private-key.pem'),
  cert: await readFile('temp/localhost.crt'),
};

const PORT = 3000;

const server = createServer(options, (req, res) => {
  res.writeHead(200, 'OK');
  res.end('Hello World!');
});

// to fix self signed certificate issues you need to add ca.crt to
// your browser security (ssl) authorities
server.listen(PORT, () => console.log(`Server started at: https://localhost:${PORT}`));
