const MEMORY_MEASURE = 'mb';
const TIME_MEASURE = 'ms';
const FIXED = 3;

export const formatTime = (time) => {
  return `${time.toFixed(FIXED)}${TIME_MEASURE}`;
};

export const formatMemory = (memoryInMb) => {
  return `${memoryInMb.toFixed(FIXED)}${MEMORY_MEASURE}`;
};

export const getHeapUsedMemoryInMb = () => {
  return Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100;
};

export const performanceTest = async (target) => {
  const start = performance.now();
  const memoryStart = getHeapUsedMemoryInMb();

  const result = await Promise.resolve(target());

  const end = performance.now();
  const memoryEnd = getHeapUsedMemoryInMb();

  const time = formatTime(end - start);
  const memoryDiff = memoryEnd - memoryStart;

  return {
    time,
    memory: { start: formatMemory(memoryStart), end: formatMemory(memoryEnd), diff: formatMemory(memoryDiff) },
    result,
  };
};

export const averageNumber = (numbers) => {
  const sum = numbers.reduce((state, num) => state + num, 0);
  const count = numbers.length;
  const fixedString = (sum / count).toFixed(FIXED);

  return Number(fixedString);
};

export const averageStringNumber = (stringNumbers) => {
  const numbers = [];

  for (let stringNumber of stringNumbers) {
    numbers.push(parseFloat(stringNumber));
  }

  return averageNumber(numbers);
};

const averageMemory = (memoryValues) => {
  const { startValues, endValues, diffValues } = memoryValues.reduce(
    (state, { start, end, diff }) => {
      state.startValues.push(start);
      state.endValues.push(end);
      state.diffValues.push(diff);

      return state;
    },
    { startValues: [], endValues: [], diffValues: [] },
  );

  return {
    start: formatMemory(averageStringNumber(startValues)),
    end: formatMemory(averageStringNumber(endValues)),
    diff: formatMemory(averageStringNumber(diffValues)),
  };
};

export const calculateAverage = ({ results, averageResult }) => {
  const { timeValues, memoryValues, resultValues } = results.reduce(
    (state, { time, memory, result }) => {
      state.timeValues.push(time);
      state.memoryValues.push(memory);
      state.resultValues.push(result);

      return state;
    },
    { timeValues: [], memoryValues: [], resultValues: [] },
  );

  const time = formatTime(averageStringNumber(timeValues));
  const memory = averageMemory(memoryValues);
  const result = averageResult(resultValues);

  return { time, memory, result };
};

export const averageFirst = (results) => results[0];
export const averageNone = () => null;
export const averageAll = (results) => results;

export const manyPerformaneTest = async ({ target, runCount, averageResult = averageAll }) => {
  const results = [];

  for (let i = 0; i < runCount; i++) {
    results.push(await performanceTest(target));
  }

  return calculateAverage({ results, averageResult });
};
