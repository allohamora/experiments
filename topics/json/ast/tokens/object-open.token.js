import { ObjectLeaf } from "../leafs/object.leaf.js";
import { TokenFinder } from "../token-finder.js";
import { Token } from "./token.js";

export class ObjectOpenToken extends Token {
  static finder = new TokenFinder('{');

  astBuildHandler({ parent }) {
    const newParent = new ObjectLeaf()
    newParent.parent = parent;

    parent.appendToBody(newParent);

    return { parent: newParent };
  }
}