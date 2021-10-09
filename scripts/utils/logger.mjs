const logTransport = [(text) => console.log(`\x1b[36m${text}`)];
const errorTransport = [(text) => console.error(`\x1b[31m${text}`)];
const warnTransport = [(text) => console.warn(`\x1b[33m${text}`)];

export const createLogger = (prefix) => {
  const formatLog = (text) => `[${prefix}] ${text}`;

  const createHandler = (transport) => {
    return async (text) => await Promise.all(
      transport.map(async handler => await Promise.resolve(handler(formatLog(text))))
    )
  }

  return {
    log: createHandler(logTransport),
    error: createHandler(errorTransport),
    warn: createHandler(warnTransport)
  };
};