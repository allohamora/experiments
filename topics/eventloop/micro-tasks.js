import { createServer } from 'node:http';

/**
 * @example
 * promise
 * queueMicrotask
 * process.nextTick
 * setImmediate
 * setTimeout
 * setTimeout 0
 */
const microAndMacro = () => {
  Promise.resolve().then(() => console.log('promise'));
  setImmediate(() => console.log('setImmediate'));
  setTimeout(() => console.log('setTimeout'));
  setTimeout(() => console.log('setTimeout 0'), 0);

  queueMicrotask(() => console.log('queueMicrotask'));

  process.nextTick(() => console.log('process.nextTick'));
};

/**
 * @example
 * setImmediate
 * setTimeout 0
 * setTimeout
 */
const timers = () => {
  setTimeout(() => console.log('setTimeout 0'), 0);
  setImmediate(() => console.log('setImmediate'));
  setTimeout(() => console.log('setTimeout'));
};

/**
 * @example
 * setImmediate
 * setTimeout 0
 */
const twoTimers = () => {
  setTimeout(() => console.log('setTimeout 0', 0));
  setImmediate(() => console.log('setImmediate'));
};

/**
 * @example
 * before
 * after
 * queueMicrotask
 * promise
 * process.nextTick
 * setImmediate
 * process.nextTick in setImmediate
 * promise in setImmediate
 * setTimeout
 * setTimeout 0
 */
const logsMicroMacro = () => {
  console.log('before');

  // the same level of priority
  queueMicrotask(() => console.log('queueMicrotask'));
  Promise.resolve().then(() => console.log('promise'));

  setTimeout(() => console.log('setTimeout'));
  setTimeout(() => console.log('setTimeout 0'), 0);
  setImmediate(() => {
    console.log('setImmediate');

    Promise.resolve().then(() => console.log('promise in setImmediate'));

    // but on the next iteration it will be before promise
    process.nextTick(() => console.log('process.nextTick in setImmediate'));
  });

  // on the first iteration it will be after promise and queueMicrotask
  process.nextTick(() => console.log('process.nextTick'));

  console.log('after');
};

logsMicroMacro()