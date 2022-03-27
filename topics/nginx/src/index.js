import { createServer, logging, routing } from './http.js';

const port = 3000;

const routes = {
  'GET:/ping': ({ reply }) => {
    reply({ data: 'pong' });
  },
  'GET:/': ({ reply }) => {
    reply({ data: 'api index' });
  },
};

const middlewares = [logging, routing(routes)];

const server = createServer({
  port,
  middlewares,
});

server.listen();
