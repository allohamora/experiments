import { ObjectLeaf } from '../leafs/object.leaf.js';
import { TokenFinder } from '../token-finder.js';
import { StringToken } from './string.token.js';
import { Token } from './base/token.js';

export class ColonToken extends Token {
  static finder = new TokenFinder(':');

  astBuildHandler({ prev, parent, invalidTokenError }) {
    if (parent instanceof ObjectLeaf && prev instanceof StringToken) {
      return;
    }

    throw invalidTokenError(prev.range);
  }
}
