import { Tokenizer } from './tokenizer.js';

const json = {
  obj: JSON.stringify({ str: 'str', num: 1, bool: false, null: null, arr: [1, 2, 3], obj: { key: 'value' } }),
  array: JSON.stringify(['b', 2, true, null, { key: 'value' }, [1]]),
  string: JSON.stringify('string'),
  boolean: JSON.stringify(false),
  null: JSON.stringify(null),
};

const tokenizer = new Tokenizer();
const tokens = tokenizer.parse(json.obj);

console.log(tokens);