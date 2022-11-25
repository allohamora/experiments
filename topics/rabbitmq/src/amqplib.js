import ampq from 'amqplib';
import { RABBITMQ_URL } from './config.js';

const queue = 'test';
const connect = await ampq.connect(RABBITMQ_URL);
const channel = await connect.createChannel();

await channel.assertQueue(queue);

channel.consume(queue, (msg) => {
  if (msg !== null) {
    console.log(msg.content.toString('utf-8'));
    channel.ack(msg);
  }
});

let count = 0;

setInterval(() => {
  count++;
  channel.sendToQueue(queue, Buffer.from(`Hello World ${count}`));
}, 5000);
