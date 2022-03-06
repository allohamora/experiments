import { TokenFinder } from "../token-finder.js";
import { Token } from "./token.js";
import { ArrayLeaf } from '../leafs/array.leaf.js';

export class ArrayCloseToken extends Token {
  static finder = new TokenFinder('\\]');

  astBuildHandler({ parent, invalidTokenError }) {
    if( parent instanceof ArrayLeaf ) {
      parent.appendToTokens(this);
      parent.appendToRange(this.range[1]);

      return { parent: parent.parent };
    }

    throw invalidTokenError();
  }
}