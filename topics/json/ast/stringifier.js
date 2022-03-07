export class Stringifier {
  stringify(value) {
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
      tokens.push(`${this.stringify(key)}:${this.stringify(value)}`);
    }

    return `{${tokens.join(',')}}`;
  }

  stringifyArray(array) {
    const tokens = [];

    for ( const value of array ) {
      tokens.push(this.stringify(value));
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
}