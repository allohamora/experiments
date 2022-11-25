import { ServiceBroker } from 'moleculer';
import { RABBITMQ_URL } from './config.js';

const broker = new ServiceBroker({
  transporter: RABBITMQ_URL,
});

broker.createService({
  name: 'math',
  actions: {
    add(ctx) {
      return Number(ctx.params.a) + Number(ctx.params.b);
    },
    pow(ctx) {
      return Number(ctx.params.a) ** Number(ctx.params.b);
    },
  },
});

await broker.start();

const add = await broker.call('math.add', { a: 2, b: 2 });
const pow = await broker.call('math.pow', { a: 2, b: 2 });

console.log({ add, pow });
