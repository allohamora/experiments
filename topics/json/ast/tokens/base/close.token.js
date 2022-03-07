import { Token } from './token.js';

export class CloseToken extends Token {
  get parentLeaf() {
    return this.constructor.parentLeaf;
  }

  astBuildHandler({ parent, invalidTokenError }) {
    if (parent instanceof this.parentLeaf) {
      parent.appendToTokens(this);
      parent.appendToRange(this.range[1]);

      return { parent: parent.parent };
    }

    throw invalidTokenError();
  }
}
