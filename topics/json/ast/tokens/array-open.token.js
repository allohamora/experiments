import { ArrayLeaf } from "../leafs/array.leaf.js";
import { TokenFinder } from "../token-finder.js";
import { OpenToken } from "./base/open.token.js";

export class ArrayOpenToken extends OpenToken {
  static finder = new TokenFinder('\\[');
  static parentLeaf = ArrayLeaf;
}