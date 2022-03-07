import { ObjectLeaf } from "../leafs/object.leaf.js";
import { TokenFinder } from "../token-finder.js";
import { OpenToken } from "./base/open.token.js";

export class ObjectOpenToken extends OpenToken {
  static finder = new TokenFinder('{');
  static parentLeaf = ObjectLeaf;
}