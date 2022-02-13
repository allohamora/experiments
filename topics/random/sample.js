import { myRandom } from './random.js';
import { manyPerformaneTest } from '../../utils/performance.mjs';

const randomShuffle = (array) => {
  const copy = [...array];
  const length = copy.length;
  const lastIndex = length - 1;

  for (let i = 0; i < length; i++) {
    const randomIndex = myRandom(i, lastIndex);
    const value = copy[randomIndex];

    copy[randomIndex] = copy[i];
    copy[i] = value;
  }

  return copy;
};

const sample = (array, count) => {
  return randomShuffle(array).slice(0, count);
};

const SAMPLE_ARRAY = [1, 2, 3, 4, 5, 6];
const SAMPLE_COUNT = 6;
const RUN_COUNT = 100;

const main = async () => {
  const sampleResult = await manyPerformaneTest({
    target: () => sample(SAMPLE_ARRAY, SAMPLE_COUNT),
    runCount: RUN_COUNT,
  });

  console.log(sampleResult);
};

main();
