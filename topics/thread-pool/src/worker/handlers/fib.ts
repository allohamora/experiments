import { parentPort } from 'worker_threads';

const fib = (count: number): number => {
  if (count <= 0) return 0;
  if (count === 1) return 0;
  if (count === 2) return 1;

  return fib(count - 1) + fib(count - 2);
};

parentPort?.on('message', ([number]) => {
  parentPort?.postMessage(fib(number));
});
