import { ArrayLeaf } from "../leafs/array.leaf.js";
import { TokenFinder } from "../token-finder.js";
import { Token } from "./token.js";

export class ArrayOpenToken extends Token {
  static finder = new TokenFinder('\\[');

  astBuildHandler({ parent }) {
    const newParent = new ArrayLeaf(parent)
    newParent.appendToTokens(this);
    newParent.appendToRange(this.range[0]);
    
    parent.appendToBody(newParent);

    return { parent: newParent };
  }
}