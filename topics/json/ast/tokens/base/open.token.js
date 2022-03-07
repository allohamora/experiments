import { Token } from './token.js';

export class OpenToken extends Token {
  get parentLeaf() {
    return this.constructor.parentLeaf;
  }

  onEndHandler(parent, invalidTokenError, rangeEnd) {
    return () => {
      if (parent.tokens.length < 2) {
        throw invalidTokenError([parent.tokens[0].range[0], rangeEnd]);
      }
    };
  }

  astBuildHandler({ parent, source, onEnd, invalidTokenError }) {
    const newParent = new this.parentLeaf(parent);
    newParent.appendToTokens(this);
    newParent.appendToRange(this.range[0]);

    parent.appendToBody(newParent);

    onEnd(this.onEndHandler(newParent, invalidTokenError, source.length));

    return { parent: newParent };
  }
}
