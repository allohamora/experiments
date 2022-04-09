import { postsLangs } from '../relations/posts-langs.js';
import { Repository } from '../utils/repository.js';
import { langRepository } from './lang-repository.js';

export const postRepository = new Repository({ dataSource: [] });

postRepository.createOne({
  title: 'first post',
  content: 'post about war between cats and dogs',
});

postsLangs.set(postRepository.getAll()[0], [langRepository.getAll()[0]]);
