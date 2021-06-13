const path = require('path');
const { Worker } = require('worker_threads');
const { performance } = require('perf_hooks');

const start = performance.now();

const workerPath = path.join(__dirname, 'worker.js');
const millionWorker = new Worker(workerPath);

const million = (multiplier, name) => new Promise((res, rej) => {
  millionWorker.on('message', (data) => data.name === name && res(data));
  millionWorker.on('error', (data) => data.name === name && rej(data));

  millionWorker.postMessage({ multiplier, name });
});

// const singleMillion = multiplier => Array.from({ length: 1000000 * multiplier }, () => null).map(value => ({ hello: '12' }));

// singleMillion(10);
// singleMillion(10);
// singleMillion(10);

// const end = performance.now();
// const dif = end - start;
// const memoryUsed = process.memoryUsage().heapUsed / 1024 / 1024;

// console.log(`The script uses approximately ${Math.round(memoryUsed * 100) / 100} MB`);
// console.log({ start, end, dif });

Promise.all([million(10, 'w-1'), million(10, 'w-2'), million(10, 'w-3')]).then(async (values) => {
  const end = performance.now();
  const dif = end - start;

  console.log({ start, end, dif, values });
  await millionWorker.terminate();
});

