import { watch } from 'node:fs/promises';
import { createScript } from '../../../scripts/utils/script.js';
import { runScriptOptions } from './run.js';
import { getTopicFileName, getTopicPath } from './utils/topic.js';

const { argsSchema, handler } = runScriptOptions;

const script = createScript({
  name: 'postgres:dev',
  argsSchema,
  handler: async (ctx) => {
    const { args, logger } = ctx;
    const [topic] = args;
    const topicPath = getTopicPath(topic);
    const watcher = watch(topicPath, { encoding: 'utf-8' });

    logger.log(`start ${getTopicFileName(topic)} watching`);

    for await (const event of watcher) {
      handler(ctx);
    }
  },
});

script();
