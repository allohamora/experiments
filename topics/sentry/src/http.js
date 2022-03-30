import http from 'node:http';

export const HttpType = {
  Text: 'text/plain',
  Html: 'text/html',
  Json: 'application/json',
};

export const HttpCode = {
  Ok: 200,
  Created: 201,
  BadRequest: 400,
  NotFound: 404,
  InternalServerError: 500,
};

export const HttpMessage = {
  Ok: 'Ok',
  Created: 'Created',
  BadRequest: 'Bad Request',
  NotFound: 'Not Found',
  InternalServerError: 'Internal Server Error',
};

const createReply = (res) => {
  return ({ code = HttpCode.Ok, type = HttpType.Text, data = HttpMessage.Ok } = {}) => {
    res.statusCode = code;
    res.setHeader('Content-Type', type);
    res.end(data);
  };
};

const chain = (...funcs) => {
  return (...args) => {
    for (const func of funcs) {
      func(...args);
    }
  };
};

export const createServer = ({ port = 3000, middlewares = [] }) => {
  const handler = chain(...middlewares);

  const server = http.createServer((req, res) => {
    const reply = createReply(res);
    const ctx = { req, res, reply };

    try {
      handler(ctx);
    } catch (error) {
      req.emit('error', error);

      res.writeHead(HttpCode.InternalServerError, HttpMessage.InternalServerError);
      res.end(HttpMessage.InternalServerError);
    }
  });

  const listen = () => {
    server.listen(port, () => console.log(`server started on port: ${port}`));
  };

  return {
    server,
    listen,
  };
};

export const logging = ({ req }) => {
  const ip = req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];
  const start = Date.now();

  req.once('close', () => {
    const finish = Date.now();
    const requestTime = `${finish - start}ms`;

    console.log({ ip, userAgent, requestTime });
  });
};

const parseRoutes = (routes) => {
  return Object.entries(routes).map(([path, handler]) => {
    const [method, urlRegexp] = path.split(':');
    const regexp = new RegExp(urlRegexp);

    return {
      handler,
      method,
      regexp,
    };
  });
};

export const routing = (routes) => {
  const parsedRoutes = parseRoutes(routes);

  return (ctx) => {
    const { req, reply } = ctx;
    const { url, method } = req;
    const route = parsedRoutes.find(({ method: routeMethod, regexp }) => {
      const isMethodMatch = routeMethod.toLowerCase() === method.toLowerCase();
      const isRegexpMatch = regexp.test(url);

      return isMethodMatch && isRegexpMatch;
    });

    if (!route) {
      reply({ code: 404, data: '404' });
      return;
    }

    route.handler(ctx);
  };
};
