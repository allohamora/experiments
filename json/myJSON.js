const primitiveToJSON = (key, value) => {
  switch (typeof value) {
    case 'string':
      return `"${value}"`;
    case 'undefined':
      return undefined;
    default:
      return value;
  }
};

const toJSON = (key, rawValue, params) => {
  const value = params.replacer ? params.replacer(key, rawValue) : rawValue;

  const stringifyArray = () => {
    const { tabSize, initValue } = params;
    const array = value;
    const tokens = [];
  
    array.forEach((value, index) => {
      if( value === undefined ) return;

      tokens.push(toJSON(index, value, {...params, tabSize: tabSize * 2}));
    });
  
    if( tabSize !== 0 ) {
      const spaces = ' '.repeat(tabSize);

      if( array !== initValue ) {
        const beforeEndSpaces = ' '.repeat(tabSize / 2);

        return `[\n${spaces}${tokens.join(`,\n${spaces}`)}\n${beforeEndSpaces}]`;
      }

      return `[\n${spaces}${tokens.join(`,\n${spaces}`)}\n]`
    }
  
    return `[${tokens.join(',')}]`;
  };

  const stringifyObject = () => {
    const { tabSize, initValue } = params;
    const object = value;
    const tokens = new Map();
  
    const keys = Object.keys(object);
  
    keys.forEach(key => {
      const value = object[key];

      if( value === undefined ) return;

      tokens.set(key, toJSON(key, value, {...params, tabSize: tabSize * 2}))
    });
  
    const resultArray = Array.from(tokens.entries());
  
    if( tabSize !== 0 ) {
      const spaces = ' '.repeat(tabSize);
      const result = resultArray.map(([key, value]) => `${spaces}"${key}": ${value}`);

      if( object !== initValue ) {
        const beforeEndSpaces = ' '.repeat(tabSize / 2);

        return `{\n${result.join(`,\n`)}\n${beforeEndSpaces}}`;
      }
  
      return `{\n${result.join(`,\n`)}\n}`;
    }
  
    const result = resultArray.map(([key, value]) => `"${key}":${value}`);
  
    return `{${result.join(',')}}`
  }
  
  if( typeof value === 'object' && value !== null ) {
    if( value instanceof Array ) {
      return stringifyArray();
    }
    return stringifyObject();
  }

  return primitiveToJSON(key, value);
}

const stringify = (obj, replacer = null, tabSize = 0) => {
  return toJSON(null, obj, { replacer, tabSize, initValue: obj });
};

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
    const parameterRegexp = /"(?<key>.+?)": ?(?<value>(\{[^\}]+\})|(\[[^\]]+\])|("[^"]+\")|([^,]+))/gm;

    const keysAndValues = Array.from(parameters.matchAll(parameterRegexp))
      .map(({ groups: { key, value } }) => [key, fromJSON(value, params)]);
    
    return keysAndValues;
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
    console.log(jsonArray);
    return [];
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