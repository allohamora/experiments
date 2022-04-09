import { postsLangs } from '../relations/posts-langs.js';
import { postRepository } from '../repositories/post-repository.js';
import { HttpError, Message, StatusCode } from '../utils/http.js';

const getLangs = (postId) => {
  const post = postRepository.getOneOrFail(postId);

  if (!postsLangs.has(post)) {
    throw new HttpError({ message: Message.NotFound, statusCode: StatusCode.NotFound });
  }

  return postsLangs.get(post);
};

const findLangOrFail = ({ postId, id }) => {
  const langs = getLangs(postId);
  const parsedId = Number(id);
  const found = langs.find((lang) => lang.id === parsedId);

  if (!found) {
    throw new HttpError({ message: Message.NotFound, statusCode: StatusCode.NotFound });
  }

  return found;
};

const getAllLangs = ({ params: { postId } }) => {
  return getLangs(postId);
};

const getOneLang = ({ params: { postId, id } }) => {
  return findLangOrFail({ postId, id });
};

const getAll = () => {
  return postRepository.getAll();
};

const validateOrFail = (isInvalid) => {
  if (isInvalid) {
    throw new HttpError({ message: Message.BadRequest, StatusCode: StatusCode.BadRequest });
  }
};

const getOne = ({ params: { id } }) => {
  return postRepository.getOneOrFail(id);
};

const validateTitle = (title) => typeof title === 'string';
const validateContent = (content) => typeof content === 'string';

const createOne = ({
  reply,
  req: {
    body: { title, content },
  },
}) => {
  const isInvalid = !validateContent(content) || !validateTitle(title);
  validateOrFail(isInvalid);

  const post = postRepository.createOne({ title, content });

  reply({ statusCode: StatusCode.Created, data: post });
};

const updateOne = ({
  req: {
    body: { title, content },
  },
  params: { id },
}) => {
  const post = postRepository.getOneOrFail(id);

  const isInvalid = !validateContent(content) || !validateTitle(title);
  validateOrFail(isInvalid);

  return postRepository.updateOne({ ...post, id, title, content });
};

const patchOne = ({
  req: {
    body: { title, content },
  },
  params: { id },
}) => {
  const post = postRepository.getOneOrFail(id);

  const isEmpty = !content && !title;
  validateOrFail(isEmpty);

  const newTitle = title || found.title;
  const newContent = content || found.content;

  const isInvalid = !validateContent(newTitle) || !validateTitle(newContent);

  validateOrFail(isInvalid);

  return postRepository.updateOne({ ...post, id, title: newTitle, content: newContent });
};

const deleteOne = ({ params: { id } }) => {
  return postRepository.deleteOne(id);
};

export const posts = ({ router }) => {
  router.get('/posts', getAll);
  router.get('/posts/:id', getOne);
  router.post('/posts', createOne);
  router.put('/posts/:id', updateOne);
  router.patch('/posts/:id', patchOne);
  router.delete('/posts/:id', deleteOne);

  // nested routes approach
  router.get('/posts/:postId/langs', getAllLangs);
  router.get('/posts/:postId/langs/:id', getOneLang);
};
