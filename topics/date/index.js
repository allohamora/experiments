import { manyPerformaneTest } from '../../utils/performance.mjs';

const toTimestampA = (date) => Math.round(date.getTime() / 1000);
const toTimestampB = (date) => Math.round(+date / 1000);
const toTimestampC = (date) => Math.round(date / 1000);

const toDate = (timestamp) => new Date(timestamp * 1000);

const TEST_COUNT = 5;

const date = new Date();
const timestamp = toTimestampA(date);

const main = async () => {
  const baseOptions = { runCount: TEST_COUNT };

  const a = await manyPerformaneTest({ target: () => toTimestampA(date), ...baseOptions });
  const b = await manyPerformaneTest({ target: () => toTimestampB(date), ...baseOptions });
  const c = await manyPerformaneTest({ target: () => toTimestampC(date), ...baseOptions });

  console.log({ a, b, c, date, timestamp, timestampDate: toDate(timestamp) });
};

main();
