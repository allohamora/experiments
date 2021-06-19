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
    transform: value => BigInt(value.replace('bigint::', ''))
  },
  symbol: {
    regexp: /^symbol::.+$/gm,
    transform: value => Symbol(value.replace('symbol::', ''))
  },
  all: {
    regexp: /.?/gm,
    transform: value => value
  }
};

const jsonReviever = (key, value) => {
  const parser = Object.keys(parsers)
    .map(parserKey => {
      const parser = parsers[parserKey];

      return parser;
    })
    .find(parser => parser.regexp.test(value));
  
  return parser.transform(value);
};

const obj = { 
  string: 'string', 
  number: 12, 
  boolean: true, 
  null: null, 
  // undefined: undefined
  undefined, 
  object: {}, 
  symbol: Symbol('symbol'), 
  bigint: 12n 
};
// json will be without undefined because undefined is not a valid value
const json = JSON.stringify(obj, jsonReplacer, 2);
// if jsonRevier return undefined as value then set value operation will be ignored
const parsed = JSON.parse(json, jsonReviever);

console.log({ obj, json, parsed });