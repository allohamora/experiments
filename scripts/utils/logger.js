import { cyan, red, yellow } from './colors.js';

const logTransport = [(text) => console.log(cyan(text))];
const errorTransport = [(text) => console.error(red(text))];
const warnTransport = [(text) => console.warn(yellow(text))];

export const createLogger = (prefix) => {
  const formatLog = (text) => `[${prefix}] ${text}`;

  const createHandler = (transport) => {
    return async (text) =>
      await Promise.all(transport.map(async (handler) => await Promise.resolve(handler(formatLog(text)))));
  };

  return {
    log: createHandler(logTransport),
    error: createHandler(errorTransport),
    warn: createHandler(warnTransport),
  };
};
