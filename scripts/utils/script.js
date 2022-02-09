import { createLogger } from './logger.js';
import { filterArgv } from './argv.js';

export const createScript = ({ name, handler }) => {
  return async () => {
    const logger = createLogger(name);
    const filteredArgv = filterArgv(process.argv);

    await Promise.resolve(handler({ logger, filteredArgv })).catch((err) => logger.error(err.message));
  };
};
