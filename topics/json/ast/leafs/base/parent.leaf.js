import { Leaf } from "./leaf.js";

export class ParentLeaf extends Leaf {
  constructor(parent = null) {
    super();

    this._body = [];
    this._tokens = [];
    this._range = [];
    this._parent = parent;
  }

  get tokens() {
    return this._tokens;
  }

  get range() {
    return this.range;
  }

  get parent() {
    return this._parent;
  }

  appendToRange(pos) {
    this._range.push(pos);
  }

  appendToTokens(token) {
    this._tokens.push(token);
  }

  appendToBody(leaf) {
    this._body.push(leaf);
  }
}