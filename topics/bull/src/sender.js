import { pingQueue } from './utils/bull.js';
import { createServer, logging, routing, HttpType } from './utils/http.js';

const { PORT = 3000 } = process.env;

const routes = {
  'GET:/$': async ({ reply }) => {
    const job = await pingQueue.add({});

    console.log(`send ${job.id}`);

    const result = await job.finished();

    reply({ data: JSON.stringify(result), type: HttpType.Json });
  },
};

const server = createServer({
  port: PORT,
  middlewares: [logging, routing(routes)],
});

server.listen();
