import path from 'node:path';
import { createScript } from './utils/script.js';
import { spawnCommand } from './utils/spawn.js';
import { topicExists, TOPICS_PATH } from './utils/topic.js';
import { string, validator } from './utils/validator.js';

const open = createScript({
  name: 'topic:open',
  argsSchema: [validator('topic').is(string()).is(topicExists())],
  handler: async ({ args: [topic], logger }) => {
    await spawnCommand('code', path.join(TOPICS_PATH, topic));

    logger.log(`topic ${topic} successfully opened`);
  },
});

open();
