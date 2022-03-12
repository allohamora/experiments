import { fileWatcher } from './utils/fs.js';
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
    const onChange = async () => await handler(ctx);

    logger.log(`start ${getTopicFileName(topic)} watching`);

    await fileWatcher(topicPath, onChange);
  },
});

script();
