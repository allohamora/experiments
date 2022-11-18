const { randomUUID } = require('node:crypto');

const setTrackId = (requestParams, context, ee, next) => {
  requestParams.headers = { 'track-id': randomUUID() };

  return next();
};

module.exports = { setTrackId };