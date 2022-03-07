import { Leaf } from './leaf.js';

export class TokenLeaf extends Leaf {
  constructor(token) {
    super();
    this._token = token;
  }

  get token() {
    return this._token;
  }
}
