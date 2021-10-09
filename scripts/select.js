import { set } from './utils/options.mjs';
import { createScript } from './utils/script.mjs';
import { isTopicExists } from './utils/topic.mjs';

const script = createScript({
  name: 'select',
  handler: async ({ filteredArgv, logger }) => {
    const [topic] = filteredArgv;

    if (!topic) {
      throw new Error('Provide topic name as first argument');
    }

    const isExists = await isTopicExists(topic);

    if (!isExists) {
      throw new Error(`${topic} is not existed topic`);
    }

    await set('topic', topic);

    await logger.log(`Topic ${topic} successfully selected`);
  },
});

script();
