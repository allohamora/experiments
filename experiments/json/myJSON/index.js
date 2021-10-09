const { toJSON } = require('./toJSON');
const { fromJSON } = require('./fromJSON');

const stringify = (obj, replacer = null, tabSize = 0) => {
  return toJSON.toJSON(obj, { replacer, tabSizeStep: tabSize });
};

const parse = (json, reviever = null) => fromJSON.fromJSON(json, { reviever });

const myJSON = { stringify, parse };

module.exports = myJSON;