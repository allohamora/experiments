import { manyPerformaneTest } from '../../utils/performance.mjs';

const bubble = (array) => {
  const copy = [...array];
  let last = copy.length - 1;

  for (let i = 0; i <= last; i++) {
    const a = copy[i];
    const b = copy[i + 1];

    if (b === undefined || i === last) {
      last = i - 1;
      i = -1;
      continue;
    }

    if (a - b >= 1) {
      copy[i + 1] = a;
      copy[i] = b;
      continue;
    }
  }

  return copy;
};

const ARRAY = [3, 2, 1, 0, -1, -2, -3];
const RUN_COUNT = 100;

const main = async () => {
  const myWay = () => bubble(ARRAY);
  const nativeWay = () => [...ARRAY].sort((a, b) => a - b);

  const options = { runCount: RUN_COUNT, averageResult: (values) => values[0] };

  const my = await manyPerformaneTest({ target: myWay, ...options });
  const native = await manyPerformaneTest({ target: nativeWay, ...options });

  console.log({ my, native });
};

main();
