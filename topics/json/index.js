const myJSON = require('./myJSON');
const { performance } = require('perf_hooks');

const jsonReplacer = (key, value) => {
  switch (typeof value) {
    case 'bigint':
      return `bigint::${value.toString()}`;
    case 'symbol':
      return `symbol::${value.description}`;
    default:
      return value;
  }
};

const parsers = {
  bigint: {
    regexp: /^bigint::.+$/gm,
    transform: (value) => BigInt(value.replace('bigint::', '')),
  },
  symbol: {
    regexp: /^symbol::.+$/gm,
    transform: (value) => Symbol(value.replace('symbol::', '')),
  },
  all: {
    regexp: /.?/m,
    transform: (value) => value,
  },
};

const jsonReviever = (key, value) => {
  const parser = Object.keys(parsers)
    .map((parserKey) => {
      const parser = parsers[parserKey];

      return parser;
    })
    .find((parser) => parser.regexp.test(value));

  return parser.transform(value);
};

const obj = {
  string: 'string',
  number: 12,
  boolean: true,
  null: null,
  // undefined: undefined
  undefined,
  object: { a: 123, b: 321, c: 231, d: { a: 1, b: 2, c: 3 } },
  array: [1, 2, 3, [1, 2, 3]],
  symbol: Symbol('symbol'),
  bigint: 12n,
};
// json will be without undefined because undefined is not a valid value
const json = JSON.stringify(obj, jsonReplacer, 2);
// if jsonRevier return undefined as value then set value operation will be ignored
const parsed = JSON.parse(json, jsonReviever);

console.log({ obj, json, parsed });

const copy = { ...obj, bigint: undefined, symbol: undefined };

const getUsedMemoryInMb = () => {
  return Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100;
};

const performanceTest = (fn) => {
  const start = performance.now();

  const result = fn();

  const end = performance.now();

  const time = end - start;
  const memory = getUsedMemoryInMb();

  return { time, memory, result };
};

const stringifyTest = (...args) => {
  const baseResult = performanceTest(() => JSON.stringify(...args));
  const myResult = performanceTest(() => myJSON.stringify(...args));

  const success = baseResult.result === myResult.result;

  // return { baseResult, myResult, success };
  return { success, baseResult, myResult };
};

const typeOfCheck = (a, b) => {
  let result = true;

  for (let key in a) {
    const aValue = a[key];
    const bValue = b[key];

    const aTypeof = typeof aValue;
    const bTypeof = typeof bValue;

    if (aTypeof !== bTypeof) {
      result = false;
      break;
    }
  }

  return result;
};

const parseTest = (...args) => {
  const baseResult = performanceTest(() => JSON.parse(...args));
  const myResult = performanceTest(() => myJSON.parse(...args));

  const success = typeOfCheck(baseResult.result, myResult.result);

  // return { baseResult, myResult, success };
  return { success, baseResult, myResult };
};

console.log(stringifyTest(copy, null, 2), stringifyTest(copy, null, 0), stringifyTest(obj, jsonReplacer));

const appliedReplacerJSON = JSON.stringify(obj, jsonReplacer);

console.log(parseTest(appliedReplacerJSON, jsonReviever));
