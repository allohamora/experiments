import Koa from 'koa';
import Router from '@koa/router';
import logger from 'koa-logger';

const port = 3000;

const app = new Koa();
const router = new Router();

router
  .get('/', (ctx) => {
    ctx.body = 'index page';
  })
  .get('/ping', (ctx) => {
    ctx.body = 'pong';
  });

app.use(logger());
app.use(router.routes());

app.listen(port, () => console.log(`server listening on port: ${port}`));
