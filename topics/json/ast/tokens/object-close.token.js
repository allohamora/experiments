import { ObjectLeaf } from '../leafs/object.leaf.js';
import { TokenFinder } from '../token-finder.js';
import { CloseToken } from './base/close.token.js';

export class ObjectCloseToken extends CloseToken {
  static finder = new TokenFinder('}');
  static parentLeaf = ObjectLeaf;
}
