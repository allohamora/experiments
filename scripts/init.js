import fsp from 'fs/promises';
import path from 'path';
import { createScript } from './utils/script.js';
import { topicNotExists, TOPICS_PATH } from './utils/topic.js';
import { validator, string } from './utils/validator.js';

const SCRIPT_PLACEHOLDER = 'echo "Error: no script specified" && exit 1';

const createPackageJson = (name) => ({
  name: `${name}.topic`,
  private: true,
  scripts: {
    start: SCRIPT_PLACEHOLDER,
    dev: SCRIPT_PLACEHOLDER,
  },
});

const script = createScript({
  name: 'topic:init',
  argsSchema: [validator('topic').is(string()).is(topicNotExists())],
  handler: async ({ args: [topic], logger }) => {
    const topicPath = path.join(TOPICS_PATH, topic);
    await fsp.mkdir(topicPath);

    const packageJsonPath = path.join(topicPath, 'package.json');
    await fsp.writeFile(packageJsonPath, JSON.stringify(createPackageJson(topic), null, 2));

    logger.log(`topic ${topic} successfully created`);
  },
});

script();
