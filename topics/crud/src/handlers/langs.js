import { postsLangs } from '../relations/posts-langs.js';
import { langRepository } from '../repositories/lang-repository.js';
import { postRepository } from '../repositories/post-repository.js';
import { HttpError, Message, StatusCode } from '../utils/http.js';

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

  if (!postsLangs.has(post)) {
    throw new HttpError({ message: Message.NotFound, statusCode: StatusCode.NotFound });
  }

  return postsLangs.get(post);
};

const getOne = ({ params: { id } }) => {
  return langRepository.getOneOrFail(id);
};

export const langs = ({ router }) => {
  // not nested approach
  router.get('/langs', getAll);
  router.get('/langs/:id', getOne);
};
