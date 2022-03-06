import { Ast } from './ast.js';
import { Tokenizer } from './tokenizer.js';
import { formatWithOptions } from 'node:util';

const log = (data) => console.log(formatWithOptions({ depth: Infinity }, data));

const json = {
  obj: JSON.stringify({ str: 'str', num: 1, bool: false, null: null, arr: [1, 2, 3], obj: { key: 'value' } }),
  array: JSON.stringify(['b', 2, true, null, { key: 'value' }, [1]], null, 2),
  string: JSON.stringify('string'),
  boolean: JSON.stringify(false),
  null: JSON.stringify(null),
  invalidComma: '123,321',
  invalidColon: '123:321'
};

const target = json.array;

const tokenizer = new Tokenizer();
const ast = new Ast();

const tokens = tokenizer.parse(target);
const astTree = ast.build(target, tokens);

log(astTree);