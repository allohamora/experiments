const { parentPort } = require('worker_threads');
const { heavyOperation, getMemoryUsedMb } = require('./shared');

parentPort.on('message', ({ multiplier = 1, name }) => {
  heavyOperation(multiplier);

  const memoryUsed = getMemoryUsedMb(process);

  parentPort.postMessage({ complete: true, name, memoryUsed: `${name} ${memoryUsed} MB` });
});
