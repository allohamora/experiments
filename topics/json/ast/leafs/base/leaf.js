export class Leaf {
  static get type() {
    return this.name.replace('Leaf', '');
  }

  get type() {
    return this.constructor.type;
  }
}