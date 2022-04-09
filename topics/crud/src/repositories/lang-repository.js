import { Repository } from '../utils/repository.js';

export const langRepository = new Repository({ dataSource: [] });

langRepository.createOne({
  text: 'English',
  code: 'en',
});
