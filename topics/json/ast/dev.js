import { Ast } from './ast.js';
import { Tokenizer } from './tokenizer.js';
import { formatWithOptions } from 'node:util';
import { Parser } from './parser.js';
import { Stringifier } from './stringifier.js';
import { manyPerformaneTest, performanceTest, averageFirst } from '../../../utils/performance.mjs';

const log = (data) => console.log(formatWithOptions({ depth: Infinity }, data));

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

const MANY_DEFAULT_OPTIONS = { runCount: 100, averageResult: averageFirst };

const parseTest = async () => {
  const target = forParse.valid.object.default;
  const reviver = (key, value) => value;

  const astWay = () => {
    const tokenizer = new Tokenizer();
    const ast = new Ast();
    const parser = new Parser();
  
    parser.reviver = reviver;
  
    const tokens = tokenizer.parse(target);
    const astTree = ast.build(target, tokens);

    return parser.parse(astTree);
  }

  const JSONWay = () => JSON.parse(target, reviver);


  const singleAst = await performanceTest(astWay);
  const singleJSON = await performanceTest(JSONWay);

  const manyAst = await manyPerformaneTest({ ...MANY_DEFAULT_OPTIONS, target: astWay });
  const manyJSON = await manyPerformaneTest({ ...MANY_DEFAULT_OPTIONS, target: JSONWay });

  log({ singleAst, singleJSON, manyAst, manyJSON });
}

const stringifyTest = async () => {
  const target = forStringify.valid.object.default;
  const replacer = (key, value) => value;
  const space = 2;

  const myWay = () => {
    const stringifier = new Stringifier();
    stringifier.replacer = replacer;
    stringifier.space = space;

    return stringifier.stringify(target, replacer, space);
  };

  const JSONWay = () => JSON.stringify(target, replacer, space);

  const singleMy = await performanceTest(myWay);
  const singleJSON = await performanceTest(JSONWay);

  const multipleMy = await manyPerformaneTest({ ...MANY_DEFAULT_OPTIONS, target: myWay });
  const multipleJSON = await manyPerformaneTest({ ...MANY_DEFAULT_OPTIONS, target: JSONWay });

  log({ singleMy, singleJSON, multipleMy, multipleJSON });
};

const main = async () => {
  await parseTest();
  await stringifyTest();
}

main();