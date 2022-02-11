import { deepStrictEqual } from 'assert/strict';
import { compare } from './my-compare.js';

const assignWay = (actual, expected) => {
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

const main = () => {
  const assign = assignWay(userCopy, user);
  const my = myWay(user, userCopy);

  console.log({ assign, my });
};

main();
