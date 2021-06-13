const { parentPort } = require('worker_threads');

parentPort.on('message', ({ multiplier = 1, name }) => {
  Array.from({ length: 1000000 * multiplier }, () => null).map(value => ({ hello: '12' }));

  const memoryUsed = process.memoryUsage().heapUsed / 1024 / 1024;
  const memoryUsedMb = Math.round(memoryUsed * 100) / 100;

  parentPort.postMessage({ complete: true, name, used: `${name} ${memoryUsedMb} MB` });
})