import { FileLeaf } from "./leafs/file.leaf.js";

export class Ast {
  invalidTokenError(range, source) {
    return new Error(`invalid token on position: ${range.join('-')}. raw: '${source.slice(...range)}'`)
  }

  build(source, tokens, pos = 0, parent = new FileLeaf(source)) {
    if( pos === tokens.length ) {
      return parent;
    }

    const curr = tokens[pos];
    const prev = tokens[pos - 1];
    const next = tokens[pos + 1];

    const context = { source, tokens, pos, parent, curr, prev, next, invalidTokenError: (token = curr) => this.invalidTokenError(token.range, source) };

    const contextMutations = curr.astBuildHandler(context);
    const afterRunCtx = { ...context, pos: pos + 1, ...contextMutations };

    return this.build(afterRunCtx.source, afterRunCtx.tokens, afterRunCtx.pos, afterRunCtx.parent);
  }
}