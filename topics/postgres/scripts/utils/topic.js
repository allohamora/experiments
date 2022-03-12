import path from 'node:path';
import fsp from 'node:fs/promises';
import { ROOT_PATH } from './path.js';
import { isExists } from '../../../../scripts/utils/fs.js';
import { createRule } from '../../../../scripts/utils/validator.js';

export const TOPICS_PATH = path.resolve(ROOT_PATH, 'topics');

export const getTopicFileName = (topic) => `${topic}.sql`;

export const getTopicPath = (topic) => {
  return path.join(TOPICS_PATH, getTopicFileName(topic));
};

export const getTopicContent = async (topic) => {
  const topicPath = getTopicPath(topic);

  return await fsp.readFile(topicPath, 'utf-8');
};

export const isTopicExists = async (topic) => {
  const topicPath = getTopicPath(topic);

  return await isExists(topicPath);
};

export const topicExist = createRule({
  errorMsg: `topic ${getTopicFileName('{value}')} is not exists`,
  test: async ({ value }) => isTopicExists(value),
});
