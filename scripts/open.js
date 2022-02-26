import path from 'node:path';
import { createScript } from './utils/script.js';
import { spawnCommand } from './utils/spawn.js';
import { isTopicExists, TOPICS_PATH } from './utils/topic.js';

const open = createScript({
  name: 'open',
  handler: async ({ filteredArgv, logger }) => {
    const [topic] = filteredArgv;

    if (!topic) {
      throw new Error('Provide topic name as first argument');
    }

    if (!(await isTopicExists(topic))) {
      throw new Error(`Topic ${topic} is not exists`);
    }

    await spawnCommand('code', path.join(TOPICS_PATH, topic));

    logger.log(`Topic ${topic} successfully opened`);
  },
});

open();
