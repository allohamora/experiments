import { ArrayLeaf } from '../leafs/array.leaf.js';
import { ObjectLeaf } from '../leafs/object.leaf.js';
import { TokenFinder } from '../token-finder.js';
import { Token } from './base/token.js';
import { ArrayCloseToken } from './array-close.token.js';
import { ArrayOpenToken } from './array-open.token.js';
import { ObjectCloseToken } from './object-close.token.js';
import { ObjectOpenToken } from './object-open.token.js';
import { RawToken } from './raw.token.js';
import { StringToken } from './string.token.js';

export class CommaToken extends Token {
  static finder = new TokenFinder(',');

  supportedPrev = [ArrayCloseToken, ObjectCloseToken, RawToken, StringToken];
  supportedNext = [ArrayOpenToken, ObjectOpenToken, RawToken, StringToken];

  astBuildHandler({ parent, invalidTokenError, prev, next }) {
    const isParentSupportsComma = parent instanceof ArrayLeaf || parent instanceof ObjectLeaf;
    if (!isParentSupportsComma) {
      throw invalidTokenError();
    }

    const isNextSupported = this.supportedNext.some((constructor) => next instanceof constructor);
    const isPrevSupported = this.supportedPrev.some((constructor) => prev instanceof constructor);
    if (!isNextSupported || !isPrevSupported) {
      throw invalidTokenError();
    }
  }
}
