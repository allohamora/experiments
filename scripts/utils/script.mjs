import { createLogger } from './logger.mjs';
import { filterArgv } from './argv.mjs';
import { get } from './options.mjs';
import { isTopicExists, TOPICS_PATH } from './topic.mjs';
import { spawn } from 'child_process';
import path from 'path';

export const createScript =
  ({ name, handler }) =>
  async () => {
    const logger = createLogger(name);
    const filteredArgv = filterArgv(process.argv);

    await Promise.resolve(handler({ logger, filteredArgv })).catch((err) => logger.error(err.message));
  };

export const createRunInTopicHandler = (command, args) => async () => {
  const topic = await get('topic');

  if (!topic) {
    throw new Error('First select a topic (npm run select $topic)');
  }

  if (!(await isTopicExists(topic))) {
    throw new Error(`Topic ${topic} is not exists. Select a valid topic and try again`);
  }

  const topicPath = path.resolve(TOPICS_PATH, topic);

  spawn(command, args, { cwd: topicPath, stdio: 'inherit' });
};
