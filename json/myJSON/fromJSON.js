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

  if( !isBracketsCloses(brackets, close) ) {
    throw new Error(`invalid json, target: ${jsonObject}`);
  }

  return params;
}

class TypeFromJSON {
  constructor(rootFromJSON){
    this.rootFromJSON = rootFromJSON;
  }

  fromJSON(json, params){
    throw new Error('override fromJSON method');
  }

  check(json){
    throw new Error('override check method');
  }
}

class ObjectFromJSON extends TypeFromJSON {
  parseParameters = (parameters, params) => {
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
      const value = this.rootFromJSON(jsonValue, params);

      if( value === undefined ) {
        continue;
      }

      result.push([key, value]);
    }

    return result;
  }

  fromJSON(jsonObject, params){
    const parsedParams = parseStringParams(['{', '}'], jsonObject);

    const parameters = this.parseParameters(parsedParams, params);
    const result = parameters.reduce((state, [key, value]) => {
      state[key] = value;

      return state;
    }, {});

    return result;
  }

  check(json){
    return json[0] === '{';
  }
}

class ArrayFromJSON extends TypeFromJSON {
  fromJSON(jsonArray, params){
    const parsedParams = parseStringParams(['[', ']'], jsonArray);

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

    for( const current of parsedParams ) {
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

      if( number === parsedParams.length ) {
        saveAndReset();
      }
    }

    const result = values.map(value => this.rootFromJSON(value, params));

    return result;
  }

  check(json){
    return json[0] === '[';
  }
}

class StringFromJSON extends TypeFromJSON {
  fromJSON(json){
    return json.replace(/"/gm, '')
  }

  check(json){
    return json.startsWith('"')
  }
}

class NumberFromJSON extends TypeFromJSON {
  fromJSON(json){
    return parseInt(json);
  }

  check(json){
    const parsedNumber = parseInt(json);
    return !isNaN(parsedNumber);
  }
}

const equalityCheckTypeFromJSON = (equalityItem, returnedValue) => {
  return class ExactFromJSON extends TypeFromJSON {
    fromJSON(){
      return returnedValue;
    }

    check(json){
      return json === equalityItem;
    }
  }
}

const FalseFromJSON = equalityCheckTypeFromJSON('false', false);
const TrueFromJSON = equalityCheckTypeFromJSON('true', true);
const NullFromJSON = equalityCheckTypeFromJSON('null', null);

class FromJSON {
  #fromJSONTypes = [];

  constructor(...fromJSONTypes){
    this.fromJSON = this.fromJSON.bind(this);

    this.#fromJSONTypes = fromJSONTypes.map(type => new type(this.fromJSON));
  }

  fromJSON(json, params){
    const finalJSON = params.reviever ? params.reviever(json) : json;
    const handler = this.#fromJSONTypes.find(type => type.check(finalJSON));

    if( !handler ) {
      throw new Error(`not found handler for ${finalJSON} (${json})`);
    }

    return handler.fromJSON(finalJSON, params);
  }
}

const fromJSON = new FromJSON(
  ObjectFromJSON, 
  ArrayFromJSON, 
  StringFromJSON, 
  NumberFromJSON, 
  NullFromJSON, 
  FalseFromJSON, 
  TrueFromJSON
);

module.exports = { fromJSON };