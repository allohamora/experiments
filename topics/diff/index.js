import { manyPerformaneTest } from '../../utils/performance.mjs';

const isObject = (value) => typeof value === 'object' && value !== null;
const isPrimitive = (value) => !isObject(value) && typeof value !== 'function';
const isFunction = (value) => typeof value === 'function';

const isObjects = (a, b) => isObject(a) && isObject(b);

const isFunctionsNotEqual = (a, b) => isFunction(a) && isFunction(b) && a.toString() !== b.toString();
const isPrimitiveNotEqual = (a, b) => (isPrimitive(a) || isPrimitive(b)) && a !== b;

const objectsEqual = (a, b, { deepEqual }) => {
  const keysSet = new Set([...Object.keys(a), ...Object.keys(b)]);
  const keys = Array.from(keysSet);

  for (const key of keys) {
    const values = [a[key], b[key]];

    if (isPrimitiveNotEqual(...values)) {
      return false;
    }

    if (isFunctionsNotEqual(...values)) {
      return false;
    }

    if (isObjects(...values) && !deepEqual(...values)) {
      return false;
    }
  }

  return true;
};

const deepEqual = (a, b) => {
  if (a === b) {
    return true;
  }

  if (isPrimitiveNotEqual(a, b)) {
    return false;
  }

  if (isFunctionsNotEqual(a, b)) {
    return false;
  }

  return objectsEqual(a, b, { deepEqual });
};

const objectDiff = (a, b) => {
  const keysSet = new Set([...Object.keys(a), ...Object.keys(b)]);
  const keys = Array.from(keysSet);

  return keys.reduce((result, key) => {
    const values = [a[key], b[key]];

    if (!deepEqual(...values)) {
      result.push({ key, values });
    }

    return result;
  }, []);
};

const arrayDiff = (...targets) => {
  const tableOfContent = targets.flat(1).reduce((map, key) => {
    const value = map.get(key) ?? 0;
    map.set(key, value + 1);

    return map;
  }, new Map());

  return Array.from(tableOfContent.entries())
    .filter(([, value]) => value === 1)
    .map(([key]) => key);
};

const objectDiffTestTarget = () => {
  const a = {
    null: null,
    obj: { test: 2 },
    int: 2,
    bigInt: 2n,
    func() {},
    test: 2,
  };

  const b = {
    null: null,
    obj: { test: 2 },
    int: 2,
    bigInt: 2n,
    func() {},
    test2: {},
  };

  return objectDiff(a, b);
};

const arrayDiffTestTarget = () => {
  const a = [1, 2, 3, {}, 5n];
  const b = [3, 2, {}, 5n];

  return arrayDiff(a, b);
};

const RUN_COUNT = 100;

const main = async () => {
  const defaultOptions = { runCount: RUN_COUNT, averageResult: (values) => values[0] };
  const objectDiffTest = await manyPerformaneTest({ ...defaultOptions, target: objectDiffTestTarget });
  const arrayDiffTest = await manyPerformaneTest({ ...defaultOptions, target: arrayDiffTestTarget });

  console.log({ objectDiffTest, arrayDiffTest });
};

main();
