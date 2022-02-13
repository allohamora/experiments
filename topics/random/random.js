import { randomInt } from 'crypto';
import { manyPerformaneTest, averageNumber } from '../../utils/performance.mjs';
import url from 'url';

export const myRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const cryptoRandom = randomInt;

const MIN = 0;
const MAX = 10;
const RUN_COUNT = 100;

const main = async () => {
  const baseOptions = { runCount: RUN_COUNT, averageResult: averageNumber };
  const my = await manyPerformaneTest({ ...baseOptions, target: () => myRandom(MIN, MAX) });
  const crypto = await manyPerformaneTest({ ...baseOptions, target: () => cryptoRandom(MIN, MAX) });

  console.log({ my, crypto });
};

if (import.meta.url === url.pathToFileURL(process.argv[1]).href) {
  main();
}
