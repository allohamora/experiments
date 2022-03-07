import { ArrayLeaf } from "./leafs/array.leaf.js";
import { FileLeaf } from "./leafs/file.leaf.js";
import { KeyLeaf } from "./leafs/key.leaf.js";
import { ObjectLeaf } from "./leafs/object.leaf.js";
import { ValueLeaf } from "./leafs/value.leaf.js";
import { debuglog } from 'node:util';

const debug = debuglog('json:parser');

export class Parser {
  get reviver() {
    return this._reviver;
  }

  set reviver(reviver) {
    return this._reviver = reviver;
  }

  parse(leaf) {    
    switch (true) {
      case leaf instanceof FileLeaf:
        return this.parseFile(leaf);
      case leaf instanceof ObjectLeaf:
        return this.parseObject(leaf);
      case leaf instanceof ArrayLeaf:
        return this.parseArray(leaf);
      case leaf instanceof ValueLeaf:
        return this.parseValue(leaf);
      case leaf instanceof KeyLeaf:
        return this.parseKey(leaf);
      default:
        throw new Error(`invalid leaf: ${leaf}`);
    }
  }

  parseFile(fileLeaf) {
    return this.handleValueReviver(this.parse(fileLeaf.body[0]));
  }

  parseObject(objectLeaf) {
    const state = {};

    for ( let i = 0; i < objectLeaf.body.length; i+=2 ) {
      const curr = objectLeaf.body[i];
      const next = objectLeaf.body[i + 1];

      const key = this.parse(curr);
      const value = this.parse(next);

      state[key] = this.handleReviver(key, value);
    }

    return state;
  }

  parseArray(arrayLeaf) {
    return arrayLeaf.body.reduce((state, curr, i) => {
      state.push(this.handleReviver(i.toString(), this.parse(curr)));

      return state;
    }, []);
  }

  parseValue(valueLeaf) {
    const value = valueLeaf.token.value;

    switch (true) {
      case value === 'true':
        return true;
      case value === 'false':
        return false;
      case value === 'null':
        return null;
      case value.startsWith('"'):
        return this.parseString(value);
      case /^\d/.test(value):
        return Number(value);
      default:
        debug(`invalid value: ${value}`);
        return value;
    }
  }

  parseKey(keyLeaf) {
    const value = keyLeaf.token.value;

    return this.parseString(this.parseString(value));
  }

  parseString(string) {
    return string.replace(/^"(.+)"$/, '$1');
  }

  handleReviver(key, value) {
    if( this._reviver ) {
      return this._reviver(key, value);
    }

    return value;
  }

  handleValueReviver(value) {
    return this.handleReviver('', value);
  }
}