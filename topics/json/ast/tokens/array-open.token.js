import { ArrayLeaf } from "../leafs/array.leaf.js";
import { TokenFinder } from "../token-finder.js";
import { Token } from "./token.js";

export class ArrayOpenToken extends Token {
  static finder = new TokenFinder('\\[');

  astBuildHandler({ parent }) {
    const newParent = new ArrayLeaf()
    newParent.parent = parent;

    parent.appendToBody(newParent);

    return { parent: newParent };
  }
}