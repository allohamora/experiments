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
 * setTimeout
 * setTimeout 0
 */
const logsMicroMacro = () => {
  console.log('before');

  queueMicrotask(() => console.log('queueMicrotask'));
  Promise.resolve().then(() => console.log('promise'));
  setTimeout(() => console.log('setTimeout'));
  setTimeout(() => console.log('setTimeout 0'), 0);
  setImmediate(() => console.log('setImmediate'));

  process.nextTick(() => console.log('process.nextTick'));

  console.log('after');
};
