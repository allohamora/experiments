import { createServer } from 'http';

const { PORT = 3000 } = process.env;

const server = createServer((req, res) => {
  res.statusCode = 200;
  res.end('hello world!');
});

server.listen(PORT, () => console.log(`server started on port: ${PORT}`));
