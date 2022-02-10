import { createServer } from 'http';

const { PORT = 3000, HOSTNAME } = process.env;

const chain =
  (...funcs) =>
  (...args) => {
    for (const func of funcs) {
      func(...args);
    }
  };

const logging = (req, res) => {
  const ip = req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];
  const start = Date.now();

  req.once('close', () => {
    const finish = Date.now();
    const requestTime = `${finish - start}ms`;

    console.log({ ip, userAgent, requestTime });
  });
};

const routes = {
  '/': (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('hello world!');
  },
};

const routing = (req, res) => {
  const { url } = req;
  const route = routes[url];

  if (!route) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('404');
    return;
  }

  route(req, res);
};

const server = createServer(chain(logging, routing));

server.listen(PORT, () => console.log(`server started on port: ${PORT}, hostname: ${HOSTNAME}`));
