import { tokens } from './tokens.js';

export class Tokenizer {
  parse(json) {
    const result = [];

    for( let i = 0; i < json.length; i++ ) {
      const finded = this.findTokenTypeMatch(json, i);

      if( finded === null ) {
        throw new Error(`invalid input on position: ${i}-${json.length}. raw: '${json.slice(i)}'`);
      }

      const { token, match } = finded;
      const { value, range } = match;

      result.push(new token(value, range));

      const [, lastIndex] = range;
      i = lastIndex - 1;
    }

    return result;
  }

  findTokenTypeMatch(body, pos) {
    for(const token of tokens) {
      const match = token.finder.matchByPos(body, pos);

      if( match ) {
        return { match, token };
      }
    }

    return null;
  }
}