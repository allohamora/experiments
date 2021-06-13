const path = require('path');
const { Worker } = require('worker_threads');
const { performance } = require('perf_hooks');
const { heavyOperation, getMemoryUsedMb } = require('./shared');

const workerPath = path.join(__dirname, 'worker.js');
const worker = new Worker(workerPath);

const MULTIPLIER = 10;
const OPERATION_COUNT = 4;

const workerPromise = (name) => new Promise((res, rej) => {
  worker.on('message', (data) => data.name === name && res(data));
  worker.on('error', (data) => data.name === name && rej(data));

  worker.postMessage({ multiplier: MULTIPLIER, name });
});

const syncWay = async () => {
  // don't return because array with 10m length view too big in console.
  Array.from({ length: OPERATION_COUNT }, () => heavyOperation(MULTIPLIER));
};

const workerWay = async () => {
  const promises = Array.from({ length: OPERATION_COUNT }, (_,i) => workerPromise(`w-${i + 1}`));
  const values = await Promise.all(promises);

  return values;
};

const logWay = async (way) => {
  const start = performance.now();
  const values = await way();
  const end = performance.now();

  const memoryUsed = getMemoryUsedMb(process);
  const usedTime = end - start;

  console.log({ values, usedTime, memoryUsed });
};

const main = async() => {
  await logWay(workerWay);
  await worker.terminate();

  await logWay(syncWay);
};

main();