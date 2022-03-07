import { TokenFinder } from "../token-finder.js";
import { ArrayLeaf } from '../leafs/array.leaf.js';
import { CloseToken } from './base/close.token.js';

export class ArrayCloseToken extends CloseToken {
  static finder = new TokenFinder('\\]');
  static parentLeaf = ArrayLeaf;
}