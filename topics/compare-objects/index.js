import { deepStrictEqual } from 'assert/strict';
import { compare } from './my-compare.js';
import { performanceTest } from '../../utils/performance.mjs';

const assertWay = (actual, expected) => {
  try {
    deepStrictEqual(actual, expected);

    return true;
  } catch (error) {
    return false;
  }
};

const myWay = compare;

const user = {
  id: 1,
  name: 'dude',
  roles: ['admin', 'user'],
  balance: {
    value: '20.00',
    currency: 'USD',
  },
};

const userCopy = {
  id: 1,
  name: 'dude',
  roles: ['admin', 'user'],
  balance: {
    value: '20.00',
    currency: 'USD',
  },
};

const manyCompare = ({ compareWay, values }) => {
  for (const value of values) {
    const restValues = values.filter((innerValue) => innerValue !== value);

    for (const anotherValue of restValues) {
      if (compareWay(value, anotherValue)) {
        continue;
      }

      return false;
    }
  }

  return true;
};

const ITEMS_COUNT = 100;

const main = async () => {
  const assert = await performanceTest(() => assertWay(userCopy, user));
  const my = await performanceTest(() => myWay(user, userCopy));

  const values = Array.from({ length: ITEMS_COUNT }, () => (Math.random() > 0.5 ? user : userCopy));
  const assertMany = await performanceTest(() => manyCompare({ compareWay: assertWay, values }));
  const myMany = await performanceTest(() => manyCompare({ compareWay: myWay, values }));

  console.log({ assert, my, assertMany, myMany });
};

main();
