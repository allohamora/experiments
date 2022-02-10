import { createServer } from 'http';

const { PORT = 3000, HOSTNAME } = process.env;

const chain = (...funcs) => {
  return (...args) => {
    for (const func of funcs) {
      func(...args);
    }
  };
};

const FIB_DEFAULT_INPUT = 42;
const fib = (number = FIB_DEFAULT_INPUT) => {
  if (number === 2) {
    return 1;
  }
  if (number === 1 || number < 1) {
    return 0;
  }

  return fib(number - 1) + fib(number - 2);
};

const logging = ({ req }) => {
  const ip = req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];
  const start = Date.now();

  req.once('close', () => {
    const finish = Date.now();
    const requestTime = `${finish - start}ms`;

    console.log({ ip, userAgent, requestTime });
  });
};

const replyFactory = (res) => {
  return ({ code = 200, type = 'text/plain', message = 'OK' }) => {
    res.statusCode = code;
    res.setHeader('Content-Type', type);
    res.end(message);
  };
};

const routes = {
  '/': ({ reply }) => {
    reply({ code: 200, message: 'hello world!' });
  },
  '/fib': ({ reply }) => {
    reply({ code: 200, message: `result: ${fib()}` });
  },
};

const routing = (ctx) => {
  const { req, reply } = ctx;
  const { url } = req;
  const route = routes[url];

  if (!route) {
    reply({ code: 404, message: '404' });
    return;
  }

  route(ctx);
};

const handler = chain(logging, routing);

const server = createServer((req, res) => {
  const reply = replyFactory(res);

  handler({ req, res, reply });
});

server.listen(PORT, () => console.log(`server started on port: ${PORT}, hostname: ${HOSTNAME}`));
