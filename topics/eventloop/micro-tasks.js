/**
 * @example
 * queueMicrotask
 * process.nextTick
 * setImmediate
 * setTimeout
 * setTimeout 0
 */
const microAndMacro = () => {
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
  setTimeout(() => console.log('setTimeout'));
  setImmediate(() => console.log('setImmediate'));
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
 * process.nextTick
 * setImmediate
 * setTimeout
 * setTimeout 0
 */
const logsMicroMacro = () => {
  console.log('before');

  queueMicrotask(() => console.log('queueMicrotask'));
  setTimeout(() => console.log('setTimeout'));
  setTimeout(() => console.log('setTimeout 0'), 0);
  setImmediate(() => console.log('setImmediate'));

  process.nextTick(() => console.log('process.nextTick'));

  console.log('after');
};
