import Koa from 'koa';
import logger from 'koa-logger';
import Router from '@koa/router';
import Ajv from 'ajv';
import { debuglog } from 'node:util';

const port = 3000;

const app = new Koa();
const router = new Router();
const ajv = new Ajv({
  // transform types. e.g. '1' => 1
  coerceTypes: true,
});

const validateDebug = debuglog('app:debug');

const validateParams = (schema) => {
  return async (ctx, next) => {
    validateDebug({ msg: 'before', params: ctx.params });

    const validate = ajv.compile(schema);
    const valid = validate(ctx.params); // mutate object. e.g. { a: '1' } => { a: 1 };

    validateDebug({ msg: 'after', params: ctx.params });

    if (!valid) {
      ctx.status = 400;
      ctx.body = validate.errors;
    } else {
      await next();
    }
  };
};

router
  .get('/', (ctx) => {
    ctx.body = 'index page';
  })
  .get('/ping', (ctx) => {
    ctx.body = 'pong';
  })
  .get(
    '/summ/:a/:b',
    validateParams({
      type: 'object',
      properties: {
        a: { type: 'integer' },
        b: { type: 'integer' },
      },
      required: ['a', 'b'],
      additionalProperties: false,
    }),
    (ctx) => {
      const { a, b } = ctx.params;

      ctx.body = a + b;
    },
  );

app.use(logger());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port, () => console.log(`server listening on port: ${port}`));
