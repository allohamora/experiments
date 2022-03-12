import { createLogger } from './logger.js';
import { filterArgv } from './argv.js';

const handleArgsSchema = async (argsSchema, args) => {
  if (argsSchema === undefined) {
    return;
  }

  for (let i = 0; i < argsSchema.length; i++) {
    const validator = argsSchema[i];
    const value = args[i];

    await validator.validate({ value });
  }
};

export const createScript = ({ name, handler, argsSchema }) => {
  return async () => {
    const logger = createLogger(name);
    const args = filterArgv(process.argv);

    try {
      await handleArgsSchema(argsSchema, args);
      await Promise.resolve(handler({ logger, args }));
    } catch (err) {
      logger.error(err.message);
    }
  };
};
