import { langRepository } from '../repositories/lang-repository.js';
import { postRepository } from '../repositories/post-repository.js';

const getAll = ({
  req: {
    query: { postId },
  },
}) => {
  const langs = langRepository.getAll();

  if (!postId) {
    return langs;
  }

  const post = postRepository.getOneOrFail(postId);

  return [postRepository.getOneOrFail(post.langId)];
};

export const langs = ({ router }) => {
  // not nested approach
  router.get('/langs', getAll);
};
