import fastify from 'fastify';
import { sum } from './math.js';

const PORT = Number(process.env.PORT || 3000);

const app = fastify({ logger: true });

app.get('/', async () => 'hello world!');
app.route<{ Querystring: { a: number; b: number } }>({
  url: '/sum',
  method: 'GET',
  schema: {
    querystring: {
      type: 'object',
      properties: {
        a: { type: 'number' },
        b: { type: 'number' },
      },
      additionalProperties: false,
      required: ['a', 'b'],
    },
    response: {
      200: { type: 'number' },
    },
  },
  handler: async ({ query: { a, b } }) => sum(a, b),
});

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
