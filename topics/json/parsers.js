import { performanceTest, averageFirst, manyPerformaneTest } from '../../utils/performance.mjs';
import { createContext, runInContext } from 'node:vm';

const JSONWay = (json) => JSON.parse(json);
const evalWay = (json) => eval(`() => (${json})`)();
const vmWay = (json) => {
  const contextTarget = { exports: null };
  const context = createContext(contextTarget);

  runInContext(`exports = ${json}`, context);

  return contextTarget.exports;
};

const json = JSON.stringify({
  str: 'str',
  num: 1,
  true: true,
  false: false,
  null: null,
  obj: { a: 'b' },
  arr: [1, 2, 3],
});

const test = (testRunner) => async (ways) => {
  const result = {};

  for (const way of ways) {
    result[way.name] = await testRunner(() => way(json));
  }

  return result;
};

const main = async () => {
  const ways = [JSONWay, evalWay, vmWay];

  const manyOptions = { runCount: 100, averageResult: averageFirst };
  const many = test((target) => manyPerformaneTest({ ...manyOptions, target }));
  const single = test(performanceTest);

  console.log('single', await single(ways));
  console.log('many', await many(ways));
};

main();
