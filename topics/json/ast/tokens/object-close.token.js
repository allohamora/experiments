import { ObjectLeaf } from "../leafs/object.leaf.js";
import { TokenFinder } from "../token-finder.js";
import { Token } from "./token.js";

export class ObjectCloseToken extends Token {
  static finder = new TokenFinder('}');

  astBuildHandler({ parent, invalidTokenError }) {
    if( parent instanceof ObjectLeaf ) {
      parent.appendToTokens(this);
      parent.appendToRange(this.range[1]);

      return { parent: parent.parent };
    }

    throw invalidTokenError();
  }
}