export const getUsedMemoryInMb = () => {
  return Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100;
};

export const performanceTest = async (fn) => {
  const start = performance.now();

  const result = await Promise.resolve(fn());

  const end = performance.now();

  const time = end - start;
  const memory = getUsedMemoryInMb();

  return { time, memory, result };
};