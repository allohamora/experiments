import path from 'path';
import { isExists } from './fs.js';
import { ROOT_PATH } from './path.js';
import { createRule } from './validator.js';

export const TOPICS_PATH = path.resolve(ROOT_PATH, 'topics');

export const isTopicExists = async (name) => {
  const fullPath = path.join(TOPICS_PATH, name);

  return await isExists(fullPath);
};

export const topicExists = createRule({
  errorMsg: '{value} topic is not exists',
  test: async ({ value }) => await isTopicExists(value),
});

export const topicNotExists = createRule({
  errorMsg: '{value} topic is exists',
  test: async ({ value }) => !(await isTopicExists(value)),
});
