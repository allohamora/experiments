import { fastify } from 'fastify';

const PORT = 3000;

const app = fastify();

app.get('/', async (request, reply) => {
  return 'hello world';
});

app.listen({ port: PORT }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running at http://localhost:${PORT}/`);
});
