import { FileLeaf } from './leafs/file.leaf.js';
import { SyntaxError } from './syntax.error.js';

export class Ast {
  invalidTokenError(range, source) {
    return new SyntaxError(range, source);
  }

  build(source, tokens, pos = 0, parent = new FileLeaf(source), onEndHandlers = []) {
    if (pos === tokens.length) {
      onEndHandlers.forEach((handler) => handler());

      return parent;
    }

    const curr = tokens[pos];
    const prev = tokens[pos - 1];
    const next = tokens[pos + 1];

    const context = {
      source,
      tokens,
      pos,
      parent,
      curr,
      prev,
      next,
      onEnd: (fn) => onEndHandlers.push(fn),
      invalidTokenError: (range = curr.range) => this.invalidTokenError(range, source),
    };

    const contextMutations = curr.astBuildHandler(context);
    const afterRunCtx = { ...context, pos: pos + 1, ...contextMutations };

    return this.build(afterRunCtx.source, afterRunCtx.tokens, afterRunCtx.pos, afterRunCtx.parent, onEndHandlers);
  }
}
