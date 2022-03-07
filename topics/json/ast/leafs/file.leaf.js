import { ParentLeaf } from './base/parent.leaf.js';

export class FileLeaf extends ParentLeaf {
  constructor(source) {
    super();
    this._source = source;

    this.appendToRange(0);
    this.appendToRange(this._source.length);
  }

  get source() {
    return this._source;
  }
}
