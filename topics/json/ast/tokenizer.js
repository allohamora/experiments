import { tokenTypes } from './token-types.js';
import { Token } from './token.js';

export class Tokenizer {
  parse(json) {
    const result = [];

    for( let i = 0; i < json.length; i++ ) {
      const finded = this.findTokenTypeMatch(json, i);

      if( finded === null ) {
        throw new Error(`invalid input on position: ${i}-${json.length}. raw: '${json.slice(i)}'`);
      }

      const { tokenType, match } = finded;
      const { value, range } = match;
      const { type } = tokenType;

      result.push(new Token(type, value, range));

      const [, lastIndex] = range;
      i = lastIndex - 1;
    }

    return result;
  }

  findTokenTypeMatch(body, pos) {
    for(const tokenType of tokenTypes) {
      const match = tokenType.matchByPos(body, pos);

      if( match ) {
        return { match, tokenType };
      }
    }

    return null;
  }
}