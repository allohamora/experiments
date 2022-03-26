import { pingQueue } from './utils/bull.js';

const { CONSUMER_ID } = process.env;

pingQueue.process((job, done) => {
  console.log(`ping from ${CONSUMER_ID} is starting`);

  done(null, { message: `pong from ${CONSUMER_ID}` });
});
