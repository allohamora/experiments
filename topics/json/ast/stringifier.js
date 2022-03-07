export class Stringifier {
  get space() {
    return this._space;
  }

  set space(space) {
    return (this._space = space);
  }

  get replacer() {
    return this._replacer;
  }

  set replacer(replacer) {
    return (this._replacer = replacer);
  }

  stringify(value) {
    return this.handleStringify(this.handleValueReplacer(value));
  }

  handleStringify(value, depth = 1) {
    switch (true) {
      case this.isObject(value, depth):
        return this.stringifyObject(value, depth);
      case Array.isArray(value, depth):
        return this.stringifyArray(value, depth);
      case typeof value === 'string':
        return this.stringifyString(value, depth);
      case typeof value === 'number':
      case typeof value === 'boolean':
      case value === null:
        return this.stringifyRaw(value, depth);
      default:
        throw new Error(`invalid value: ${value}`);
    }
  }

  stringifyObject(object, depth) {
    const tokens = [];

    for (const [key, value] of Object.entries(object)) {
      const handledKey = this.handleStringify(key, 0);

      const afterReplacer = this.handleReplacer(key, value);
      const handledValue = this.handleStringify(afterReplacer, depth + 1);

      const space = this._space ? ' ' : '';
      const after = this.handleSpace(depth);

      tokens.push(`${after}${handledKey}:${space}${handledValue}`);
    }

    const newLine = this._space ? '\n' : '';
    const after = this.handleSpace(depth - 1);

    return `{${newLine}${tokens.join(`,${newLine}`)}${newLine}${after}}`;
  }

  stringifyArray(array, depth) {
    const tokens = [];

    for (let i = 0; i < array.length; i++) {
      const value = array[i];

      const afterReplacer = this.handleReplacer(i.toString(), value);
      const afterStringify = this.handleStringify(afterReplacer, depth + 1);
      const after = this.handleSpace(depth);

      tokens.push(`${after}${afterStringify}`);
    }

    const newLine = this._space ? '\n' : '';
    const after = this.handleSpace(depth - 1);

    return `[${newLine}${tokens.join(`,${newLine}`)}${newLine}${after}]`;
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
    if (this._replacer) {
      return this._replacer(key, value);
    }

    return value;
  }

  handleValueReplacer(value) {
    return this.handleReplacer('', value);
  }

  handleSpace(depth) {
    if (this._space) {
      return ' '.repeat(this._space * depth);
    }

    return '';
  }
}
