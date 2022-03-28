import Koa from 'koa';

const port = 3000;

const app = new Koa();

app.use((ctx) => {
  ctx.body = 'hello world!';
});

app.listen(port, () => console.log(`server listening on port: ${port}`));
