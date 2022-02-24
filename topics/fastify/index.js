import fastify from 'fastify';

const PORT = process.env.PORT || 3000;

const app = fastify({ logger: true });

app.get('/', () => 'hello world!');

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
