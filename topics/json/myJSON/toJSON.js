class TypeToJSON {
  constructor(rootToJSON) {
    this.rootToJSON = rootToJSON;
  }

  toJSON(key, value, params) {
    throw new Error('override toJSON method');
  }

  check(value) {
    throw new Error('override check method');
  }
}

class PrimitiveToJSON extends TypeToJSON {
  #supportedTypes = ['string', 'number', 'boolean', 'undefined'];

  toJSON(key, value) {
    switch (typeof value) {
      case 'string':
        return `"${value}"`;
      default:
        return `${value}`;
    }
  }

  check(value) {
    return this.#supportedTypes.includes(typeof value);
  }
}

class ObjectToJSON extends TypeToJSON {
  getJSONedKeysAndValues(object, params) {
    const { tabSize, tabSizeStep } = params;

    const keys = Object.keys(object);
    const keysAndValuesMap = keys.reduce((map, key) => {
      const value = object[key];

      if (value === undefined) return map;

      map.set(key, this.rootToJSON(key, value, { ...params, tabSize: tabSize + tabSizeStep }));

      return map;
    }, new Map());

    const keysAndValues = Array.from(keysAndValuesMap.entries());

    return keysAndValues;
  }

  toJSON(key, object, params) {
    const { initValue, tabSize, tabSizeStep } = params;
    const JSONedKeysAndValues = this.getJSONedKeysAndValues(object, params);

    if (tabSize !== 0) {
      const spaces = ' '.repeat(tabSize);
      const result = JSONedKeysAndValues.map(([key, value]) => `${spaces}"${key}": ${value}`);

      if (object !== initValue) {
        const beforeEndSpaces = ' '.repeat(tabSize - tabSizeStep);

        return `{\n${result.join(`,\n`)}\n${beforeEndSpaces}}`;
      }

      return `{\n${result.join(`,\n`)}\n}`;
    }

    const result = JSONedKeysAndValues.map(([key, value]) => `"${key}":${value}`);

    return `{${result.join(',')}}`;
  }

  check(value) {
    return typeof value === 'object' && value !== null && !(value instanceof Array);
  }
}

class ArrayToJSON extends TypeToJSON {
  getJSONedValues(array, params) {
    const { tabSize, tabSizeStep } = params;

    return array.reduce((values, current, index) => {
      if (current === undefined) return values;

      values.push(this.rootToJSON(index.toString(), current, { ...params, tabSize: tabSize + tabSizeStep }));

      return values;
    }, []);
  }

  toJSON(key, array, params) {
    const { tabSize, tabSizeStep, initValue } = params;
    const JSONedValues = this.getJSONedValues(array, params);

    if (tabSize !== 0) {
      const spaces = ' '.repeat(tabSize);

      if (array !== initValue) {
        const beforeEndSpaces = ' '.repeat(tabSize - tabSizeStep);

        return `[\n${spaces}${JSONedValues.join(`,\n${spaces}`)}\n${beforeEndSpaces}]`;
      }

      return `[\n${spaces}${JSONedValues.join(`,\n${spaces}`)}\n]`;
    }

    return `[${JSONedValues.join(',')}]`;
  }

  check(value) {
    return typeof value === 'object' && value !== null && value instanceof Array;
  }
}

class NullToJSON extends TypeToJSON {
  toJSON(key, value, params) {
    return `${value}`;
  }

  check(value) {
    return value === null;
  }
}

class ToJSON {
  #types = [];

  constructor(...typesToJSON) {
    this._toJSON = this._toJSON.bind(this);

    this.#types = typesToJSON.map((type) => new type(this._toJSON));
  }

  getParams(userParams, initValue) {
    if ('initValue' in userParams) {
      throw new Error('you pass a forbidden parameter (initValue)');
    }

    const baseParams = { initValue, tabSize: userParams.tabSizeStep };
    const params = Object.assign(baseParams, userParams);

    return params;
  }

  _toJSON(key, value, params) {
    const finalValue = params.replacer ? params.replacer(key, value) : value;
    const handler = this.#types.find((handler) => handler.check(finalValue));

    if (!handler) {
      throw new Error(`handler for ${finalValue} was not found`);
    }

    return handler.toJSON(key, finalValue, params);
  }

  toJSON(value, userParams = {}) {
    const params = this.getParams(userParams, value);

    return this._toJSON('', value, params);
  }
}

const toJSON = new ToJSON(PrimitiveToJSON, ObjectToJSON, ArrayToJSON, NullToJSON);

module.exports = { toJSON };
