import { createServer } from 'node:http';

const startServer = (port) => {
  createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('hello world');
  }).listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
};

startServer(3000);
