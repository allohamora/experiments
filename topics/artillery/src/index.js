import { createServer } from 'node:http';

const PORT = 3000;

const ContentType = {
  JSON: 'application/json',
};

const server = createServer((req, res) => {
  res.writeHead(200, 'OK', { ['Content-Type']: ContentType.JSON });
  res.end(JSON.stringify({ id: 0, message: 'Hello World!' }));
});

server.listen(PORT, () => console.log(`server started at http://localhost:${PORT}`));
