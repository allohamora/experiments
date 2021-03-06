/**
 *
 * @param {number} multiplier
 * @returns {{hello: '12'}[]}
 */
const heavyOperation = (multiplier) =>
  Array.from({ length: 1000000 * multiplier }, () => null).map((value) => ({ hello: '12' }));

/**
 *
 * @param {NodeJS.Process} process
 */
const getMemoryUsedMb = (process) => {
  const memoryUsed = process.memoryUsage().heapUsed;
  const memoryUsedMb = Math.round((memoryUsed / 1024 / 1024) * 100) / 100;

  return memoryUsedMb;
};

module.exports = { heavyOperation, getMemoryUsedMb };
