import { Leaf } from "./leaf.js";

export class ParentLeaf extends Leaf {
  _body = [];
  _parent;

  get parent() {
    return this._parent;
  }

  set parent(parent) {
    return this._parent = parent;
  }

  appendToBody(leaf) {
    this._body.push(leaf);
  }
}