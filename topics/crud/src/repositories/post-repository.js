import { Repository } from '../utils/repository.js';
import { langRepository } from './lang-repository.js';

export const postRepository = new Repository({ dataSource: [] });

postRepository.createOne({
  title: 'first post',
  content: 'post about war between cats and dogs',
  langId: langRepository.getAll()[0].id,
});
