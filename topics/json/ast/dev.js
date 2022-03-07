import { Ast } from './ast.js';
import { Tokenizer } from './tokenizer.js';
import { formatWithOptions } from 'node:util';

const log = (data) => console.log(formatWithOptions({ depth: Infinity }, data));

const valid = {
  object: {
    default: JSON.stringify({ str: 'str', num: 1, bool: false, null: null, arr: [1, 2, 3], obj: { key: 'value' } }),
  },
  array: {
    default: JSON.stringify(['b', 2, true, null, { key: 'value' }, [1]], null, 2),
  },
  string: {
    default:  JSON.stringify('string'),
  },
  boolean: {
    default: JSON.stringify(false),
  },
  null: {
    default: JSON.stringify(null)
  }
};

const invalid = {
  comma: {
    default: '123,321',
    object: '{"key":"value",}',
    array: '["value",]'
  },
  colon: {
    default: '123:321',
    object: '{key:"value"}',
    array: '["key":"value"]'
  },
  object: {
    default: '{"key":"value"',
    inner: '{"key": {}',
  },
  array: {
    default: '["value"',
    inner: '["value", []'
  }
}

const target = valid.object.default;

const tokenizer = new Tokenizer();
const ast = new Ast();

const tokens = tokenizer.parse(target);
const astTree = ast.build(target, tokens);

log(astTree);