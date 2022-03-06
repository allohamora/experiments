import { ParentLeaf } from "./base/parent.leaf.js";

export class FileLeaf extends ParentLeaf {
  constructor(source) {
    super();
    this._source = source;
  }

  get source() {
    return this._source;
  }
}