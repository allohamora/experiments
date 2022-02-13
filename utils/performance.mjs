const MEMORY_MEASURE = 'mb';
const TIME_MEASURE = 'ms';
const FIXED = 3;

export const getHeapUsedMemoryInMb = () => {
  const memoryInMb = Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100;

  return `${memoryInMb.toFixed(FIXED)}${MEMORY_MEASURE}`;
};

export const performanceTest = async (target) => {
  const start = performance.now();
  const result = await Promise.resolve(target());
  const end = performance.now();

  const executionTimeInMs = end - start;
  const time = `${executionTimeInMs.toFixed(FIXED)}${TIME_MEASURE}`;
  const memory = getHeapUsedMemoryInMb();

  return { time, memory, result };
};

export const averageNumber = (numbers) => {
  const sum = numbers.reduce((state, num) => state + num, 0);
  const count = numbers.length;
  const fixedString = (sum / count).toFixed(FIXED);

  return Number(fixedString);
}

export const averageStringNumber = (stringNumbers) => {
  const numbers = [];

  for( let stringNumber of stringNumbers ) {
    numbers.push(parseFloat(stringNumber));
  }

  return averageNumber(numbers);
}

export const calculateAverage = ({ results, averageResult }) => {
  const { timeValues, memoryValues, resultValues } = results.reduce((state, { time, memory, result }) => {
    state.timeValues.push(time);
    state.memoryValues.push(memory);
    state.resultValues.push(result);

    return state;
  }, { timeValues: [], memoryValues: [], resultValues: [] })

  const time = `${averageStringNumber(timeValues)}${TIME_MEASURE}`;
  const memory = `${averageStringNumber(memoryValues)}${MEMORY_MEASURE}`;
  const result = averageResult(resultValues);

  return { time, memory, result };
}

export const manyPerformaneTest = async ({ target, runCount, averageResult = (results) => results }) => {
  const results = [];

  for (let i = 0; i < runCount; i++) {
    results.push(await performanceTest(target));
  }

  return calculateAverage({ results, averageResult });
}