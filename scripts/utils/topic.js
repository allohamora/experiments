import path from 'path';
import { isExists } from './fs.js';
import { ROOT_PATH } from './path.js';

export const TOPICS_PATH = path.resolve(ROOT_PATH, 'topics');

export const isTopicExists = async (name) => {
  const fullPath = path.join(TOPICS_PATH, name);

  return await isExists(fullPath);
};
