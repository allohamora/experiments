import { createScript } from './utils/script.mjs';
import { isTopicExists } from './utils/topic.mjs';
import { TOPICS_PATH } from './utils/topic.mjs';
import fsp from 'fs/promises';
import path from 'path';

const SCRIPT_PLACEHOLDER = 'echo \"Error: no test specified\" && exit 1'

const createPackageJson = (name) => ({
  name,
  private: true,
  scripts: {
    start: SCRIPT_PLACEHOLDER,
    dev: SCRIPT_PLACEHOLDER
  },
  repository: {
    type: "git",
    url: "git+https://github.com/Allohamora/experiments.git"
  },
  author: "https://github.com/Allohamora",
  license: "UNLICENSED",
  bugs: {
    url: "https://github.com/Allohamora/experiments/issues"
  },
  homepage: "https://github.com/Allohamora/experiments#readme"
})

const script = createScript({
  name: 'init',
  handler: async ({ filteredArgv, logger }) => {
    const [topic] = filteredArgv;
    
    if( !topic ) {
      throw new Error('Provide topic name as first argument');
    }

    if( await isTopicExists(topic) ) {
      throw new Error(`Topic ${topic} is already exists`);
    }

    const topicPath = path.join(TOPICS_PATH, topic);
    await fsp.mkdir(topicPath);
    
    const packageJsonPath = path.join(topicPath, 'package.json');
    await fsp.writeFile(packageJsonPath, JSON.stringify(createPackageJson(topic), null, 2));

    logger.log(`Topic ${topic} successfully created`);
  }
});

script();