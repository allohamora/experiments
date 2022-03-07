import { SyntaxError } from './syntax.error.js';
import { tokens } from './tokens.js';
import { SpaceToken } from './tokens/space.token.js';

export class Tokenizer {
  blacklist = [SpaceToken];

  isNotBlacklisted(token) {
    return this.blacklist.some((tokenConstructor) => token !== tokenConstructor);
  }

  parse(json) {
    const result = [];

    for (let i = 0; i < json.length; i++) {
      const finded = this.findTokenTypeMatch(json, i);

      if (finded === null) {
        throw new SyntaxError([i, json.length], json);
      }

      const { token, match } = finded;
      const { value, range } = match;

      if (this.isNotBlacklisted(token)) {
        result.push(new token(value, range));
      }

      const [, lastIndex] = range;
      i = lastIndex - 1;
    }

    return result;
  }

  findTokenTypeMatch(body, pos) {
    for (const token of tokens) {
      const match = token.finder.matchByPos(body, pos);

      if (match) {
        return { match, token };
      }
    }

    return null;
  }
}
