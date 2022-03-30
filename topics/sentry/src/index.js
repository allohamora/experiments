import express, { Router } from 'express';
import Sentry from '@sentry/node';
import Tracing from '@sentry/tracing';

const { SENTRY_DSN, PORT = 3000 } = process.env;
const app = express();

const router = Router();

router.get('/', (req, res) => {
  res.send('index page');
});

router.get('/error', () => {
  throw new Error('error page');
});

Sentry.init({
  dsn: SENTRY_DSN,

  tracesSampleRate: 1.0,
  integrations: [new Sentry.Integrations.Http({ tracing: true }), new Tracing.Integrations.Express({ app })],
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(router);
app.listen(PORT, () => console.log(`server starten on port: ${PORT}`));
