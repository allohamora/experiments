import { Ast } from './ast.js';
import { Tokenizer } from './tokenizer.js';
import { formatWithOptions } from 'node:util';
import { Parser } from './parser.js';
import { Stringifier } from './stringifier.js';

const log = (data) => console.log(formatWithOptions({ depth: Infinity }, data));

const isObjectsEqual = (a, b) => {
  return JSON.stringify(a) === JSON.stringify(b);
}

const stringifyValid = (data, depth = 0) => {
  if( depth === 2 ) {
    return JSON.stringify(data, null, Math.random() > .5 ? 2 : undefined);
  }

  return Object.entries(data).reduce((state, [key, value]) => {
    state[key] = stringifyValid(value, depth + 1);

    return state;
  }, {});
}

const forStringify = {
  valid: {
    object: {
      default: { str: 'str', num: 1, bool: false, null: null, arr: [1, 2, 3], obj: { key: 'value' } }
    },
    array: {
      default: ['b', 2, true, null, { key: 'value' }, [1]]
    },
    string: {
      default: 'string'
    },
    boolean: {
      default: false,
      true: true,
      false: false
    },
    null: {
      default: null
    }
  }
}

const forParse = {
  valid: stringifyValid(forStringify.valid),
  invalid: {
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
}

const parse = () => {
  const target = forParse.valid.object.default;
  const reviver = (key, value) => value;

  const tokenizer = new Tokenizer();
  const ast = new Ast();
  const parser = new Parser();

  parser.reviver = reviver;

  const tokens = tokenizer.parse(target);
  const astTree = ast.build(target, tokens);
  const parsed = parser.parse(astTree);

  console.log({ isEqual: isObjectsEqual(JSON.parse(target, reviver), parsed) });
}

const stringify = () => {
  const target = forStringify.valid.object.default;
  const replacer = (key, value) => value;
  const space = 0;

  const stringifier = new Stringifier();
  stringifier.replacer = replacer;
  stringifier.space = space;

  const isEqual = stringifier.stringify(target) === JSON.stringify(target, replacer, space);

  console.log({ isEqual, a: stringifier.stringify(target), b: JSON.stringify(target, replacer, space) });
}

const main = () => {
  stringify();
}

main();