class TypeToJson {
  constructor(rootToJson){
    this.rootToJson = rootToJson;
  }

  toJson(key, value, params){
    throw new Error('override toJson method')
  }

  check(value){
    throw new Error('override check method')
  }
}

class PrimitiveToJson extends TypeToJson {
  #supportedTypes = ['string', 'number', 'boolean', 'undefined']
  
  toJson(key, value){
    switch (typeof value) {
      case 'string':
        return `"${value}"`;
      default:
        return `${value}`;
    }
  }

  check(value){
    return this.#supportedTypes.includes(typeof value);
  }
}

class ObjectToJson extends TypeToJson {
  getJsonedKeysAndValues(object, params){
    const { tabSize, tabSizeStep } = params;

    const keys = Object.keys(object);
    const keysAndValuesMap = keys.reduce((map, key) => {
      const value = object[key];

      if( value === undefined ) return map;

      map.set(key, this.rootToJson(key, value, { ...params, tabSize: tabSize + tabSizeStep }));

      return map;
    }, new Map());

    const keysAndValues = Array.from(keysAndValuesMap.entries());

    return keysAndValues;
  }

  toJson(key, object, params) {
    const { initValue, tabSize, tabSizeStep } = params;
    const jsonedKeysAndValues = this.getJsonedKeysAndValues(object, params);
  
    if( tabSize !== 0 ) {
      const spaces = ' '.repeat(tabSize);
      const result = jsonedKeysAndValues.map(([key, value]) => `${spaces}"${key}": ${value}`);

      if( object !== initValue ) {
        const beforeEndSpaces = ' '.repeat(tabSize - tabSizeStep);

        return `{\n${result.join(`,\n`)}\n${beforeEndSpaces}}`;
      }
  
      return `{\n${result.join(`,\n`)}\n}`;
    }
  
    const result = jsonedKeysAndValues.map(([key, value]) => `"${key}":${value}`);
  
    return `{${result.join(',')}}`
  }

  check(value){
    return typeof value === 'object' && value !== null && !(value instanceof Array);
  }
}

class ArrayToJson extends TypeToJson {
  getJsonedValues(array, params){
    const { tabSize, tabSizeStep } = params;

    return array.reduce((values, current, index) => {
      if( current === undefined ) return values;

      values.push(this.rootToJson(index, current, { ...params, tabSize: tabSize + tabSizeStep }));

      return values;
    }, []);
  }

  toJson(key, array, params){
    const { tabSize, tabSizeStep, initValue } = params;
    const jsonedValues = this.getJsonedValues(array, params);
  
    if( tabSize !== 0 ) {
      const spaces = ' '.repeat(tabSize);

      if( array !== initValue ) {
        const beforeEndSpaces = ' '.repeat(tabSize - tabSizeStep);

        return `[\n${spaces}${jsonedValues.join(`,\n${spaces}`)}\n${beforeEndSpaces}]`;
      }

      return `[\n${spaces}${jsonedValues.join(`,\n${spaces}`)}\n]`
    }
  
    return `[${jsonedValues.join(',')}]`;
  }

  check(value){
    return typeof value === 'object' && value !== null && value instanceof Array;
  }
}

class NullToJson extends TypeToJson {
  toJson(key, value, params){
    return `${value}`;
  }

  check(value){
    return value === null;
  }
}

class ToJson {
  #types = [];

  constructor(...typesToJson){
    this._toJson = this._toJson.bind(this);

    this.#types = typesToJson.map(type => new type(this._toJson));
  }

  getParams(userParams, initValue){
    if( 'initValue' in userParams ) {
      throw new Error('you pass a forbidden parameter (initValue)');
    }

    const baseParams = { initValue, tabSize: userParams.tabSizeStep };
    const params = Object.assign(baseParams, userParams);

    return params;
  }

  _toJson(key, value, params){
    const finalValue = params.replacer ? params.replacer(key, value) : value;
    const handler = this.#types.find(handler => handler.check(finalValue));

    if( !handler ) {
      throw new Error(`handler for ${finalValue} was not found`);
    }

    return handler.toJson(key, finalValue, params);
  }

  toJson(value, userParams = {}) {
    const params = this.getParams(userParams, value);

    return this._toJson(null, value, params);
  }
}

const toJson = new ToJson(PrimitiveToJson, ObjectToJson, ArrayToJson, NullToJson);

const stringify = (obj, replacer = null, tabSize = 0) => {
  return toJson.toJson(obj, { replacer, tabSizeStep: tabSize });
};

const combine = (...funcs) => (value) => funcs.forEach(func => func(value));

const isBracketsCloses = (brackets, close = '}') => {
  if( brackets[0] === close ) return false;

  let opened = 0;
  let closed = 0;

  for (let i = 0; i < brackets.length; i++) {
    const bracket = brackets[i];
    const isClose = bracket === close;

    if( isClose && opened === closed ) {
      return false;
    }

    if( isClose ) {
      closed++;
    } else {
      opened++;
    }
  }

  return opened === closed;
}

/**
 * 
 * @param {string} jsonData 
 * @returns 
 */
const parseJSONPrimitive = (jsonData) => {
  if( jsonData === 'true' ) return true;
  if( jsonData === 'false' ) return false;
  if( jsonData === 'null' ) return null;

  const parsedNumber = parseInt(jsonData);
  if( !isNaN(parsedNumber) ) return parsedNumber;

  if( jsonData.startsWith('"') ) return jsonData.replace(/"/gm, '');

  return jsonData;
}

const fromJSON = (json, params) => {
  const parseParameters = (parameters) => {
    const keysAndValues = [];
    
    let isKey = true;
    let isValue = false;
  
    let key = '';
    let value = '';
    let deep = 0;
    let number = 0;
  
    const changeToValue = () => {
      isKey = false;
      isValue = true;
    }
  
    const reset = () => {
      key = '';
      value = '';
  
      isKey = true;
      isValue = false;
    }

    const save = () => {
      keysAndValues.push([key, value]);
    }

    const saveAndReset = combine(save, reset);
  
    for(const current of parameters) {
      number++;
  
      if( current === '"' && isKey ) {
        continue;
      }
  
      if( current === '{' || current === '[' ) {
        deep++;
      }
  
      if( current === '}' || current === ']' ) {
        deep--;
      }
  
      if( current === ',' && deep === 0 ) {
        saveAndReset();
        continue;
      }
  
      if( current === ':' && isKey ) {
        changeToValue();
        continue;
      }
  
      if ( isKey ) {
        key += current;
      }
  
      if( isValue ) {
        value += current;
      }
  
      if( number === parameters.length ) {
        saveAndReset();
        break;
      }
    }
  
    const result = [];

    for( const [key, jsonValue] of keysAndValues ) {
      const value = fromJSON(jsonValue, params);

      if( value === undefined ) {
        continue;
      }

      result.push([key, value]);
    }

    return result;
  };

  const parseStringParams = ([open, close], jsonObject) => {
    let params = '';
    const brackets = [];

    for ( let index = 0; index < jsonObject.length; index++ ) {
      const current = jsonObject[index];

      if( current === open || current === close ) {
        brackets.push(current);
        
        if( isBracketsCloses(brackets, close) ) {
          break;
        }

        if( brackets.length === 1 ) {
          continue;
        }
      }

      params += current;
    }

    return params;
  }

  const parseArray = (jsonArray) => {
    const params = parseStringParams(['[', ']'], jsonArray);

    const values = [];

    let value = '';
    let deep = 0;
    let number = 0;

    const reset = () => {
      value = '';
    }

    const save = () => {
      values.push(value);
    }

    const saveAndReset = combine(save, reset);

    for( const current of params ) {
      number++;

      if( current === ',' && deep === 0 ) {
        saveAndReset();
        continue;
      }

      if( current === '{' || current === '[' ) {
        deep++;
      }

      if( current === '}' || current === '}' ) {
        deep--;
      }

      value += current;

      if( number === params.length ) {
        saveAndReset();
      }
    }

    const result = values.map(value => fromJSON(value, params));

    return result;
  }

  const parseObject = (jsonObject) => {
    const params = parseStringParams(['{', '}'], jsonObject);

    const parameters = parseParameters(params);
    const result = parameters.reduce((state, [key, value]) => {
      state[key] = value;

      return state;
    }, {});

    return result;
  };

  if( json[0] === '{' ) {
    return parseObject(json);
  }

  if( json[0] === '[' ) {
    return parseArray(json);
  }

  return parseJSONPrimitive(json);
}

const parse = (json, reviever = null) => fromJSON(json, { reviever });

const myJSON = { stringify, parse };

module.exports = myJSON;