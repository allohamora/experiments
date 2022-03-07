export class Stringifier {
  get replacer() {
    return this._replacer;
  }

  set replacer(replacer) {
    this._replacer = replacer
  }

  stringify(value) {
    return this.handleStringify(this.handleValueReplacer(value));
  }

  handleStringify(value) {
    switch (true) {
      case this.isObject(value):
        return this.stringifyObject(value);
      case Array.isArray(value):
        return this.stringifyArray(value);
      case typeof value === 'string':
        return this.stringifyString(value);
      case typeof value === 'number':
      case typeof value === 'boolean':
      case value === null:
        return this.stringifyRaw(value);
      default:
        throw new Error(`invalid value: ${value}`);
    }
  }

  stringifyObject(object) {
    const tokens = [];

    for ( const [key, value] of Object.entries(object) ) {
      const afterReplacer = this.handleReplacer(key, value);

      tokens.push(`${this.handleStringify(key)}:${this.handleStringify(afterReplacer)}`);
    }

    return `{${tokens.join(',')}}`;
  }

  stringifyArray(array) {
    const tokens = [];

    for ( let i = 0; i < array.length; i++ ) {
      const value = array[i];

      const afterReplacer = this.handleReplacer(i.toString(), value);
      const afterStringify = this.handleStringify(afterReplacer);

      tokens.push(afterStringify);
    }

    return `[${tokens.join(',')}]`;
  }

  stringifyString(string) {
    return `"${string}"`;
  }

  stringifyRaw(raw) {
    return `${raw}`;
  }

  isObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  handleReplacer(key, value) {
    if( this._replacer ) {
      return this._replacer(key, value);
    }

    return value;
  }

  handleValueReplacer(value) {
    return this.handleReplacer('', value);
  }
}