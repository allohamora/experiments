const FIXED = 3;

export const getHeapUsedMemoryInMb = () => {
  const memoryInMb = Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100;

  return `${memoryInMb.toFixed(FIXED)}mb`;
};

export const performanceTest = async (fn) => {
  const start = performance.now();
  const result = await Promise.resolve(fn());
  const end = performance.now();

  const executionTimeInMs = end - start;
  const time = `${executionTimeInMs.toFixed(FIXED)}ms`;
  const memory = getHeapUsedMemoryInMb();

  return { time, memory, result };
};