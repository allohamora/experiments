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

const stringify = (obj, replacer = null, tabSize = 0) => toJSON(null, obj, { replacer, tabSize, initValue: obj });

const parse = (json, reviever = null) => {

};

const myJSON = { stringify, parse };

module.exports = myJSON;