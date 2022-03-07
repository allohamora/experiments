export class Token {
  static get type() {
    return this.name.replace('Token', '');
  }

  constructor(value, range) {
    this._value = value;
    this._range = range;
  }

  get type() {
    return this.constructor.type;
  }

  get value() {
    return this._value;
  }

  get range() {
    return this._range;
  }

  astBuildHandler({ tokens, pos, parent, curr, prev, next, onEnd, invalidTokenError }) {
    throw new Error(`astBuildHandler not implemented in ${this.type}`);
  }
}