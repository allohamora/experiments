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

module.exports = { fromJSON };