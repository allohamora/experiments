import { TokenFinder } from '../token-finder.js';
import { Token } from './base/token.js';
import { ValueLeaf } from '../leafs/value.leaf.js';

export class RawToken extends Token {
  static finder = new TokenFinder('true|false|null|\\d+');

  astBuildHandler({ parent }) {
    const leaf = new ValueLeaf(this);

    parent.appendToBody(leaf);
  }
}
