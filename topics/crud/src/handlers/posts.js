import { langRepository } from '../repositories/lang-repository.js';
import { postRepository } from '../repositories/post-repository.js';
import { HttpError, Message, StatusCode } from '../utils/http.js';

const getLang = ({ params: { postId } }) => {
  const post = postRepository.getOneOrFail(postId);

  if (!post.langId) {
    throw new HttpError({ message: Message.NotFound, statusCode: StatusCode.NotFound });
  }

  return langRepository.getOneOrFail(post.langId);
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
const validateLangId = (langId) => {
  if (!langId) {
    return true;
  }

  return !!langRepository.getOne(langId);
};

const createOne = ({
  reply,
  req: {
    body: { title, content, langId },
  },
}) => {
  const isInvalid = !validateContent(content) || !validateTitle(title) || !validateLangId(langId);
  validateOrFail(isInvalid);

  const post = postRepository.createOne({ title, content, langId });

  reply({ statusCode: StatusCode.Created, data: post });
};

const updateOne = ({
  req: {
    body: { title, content, langId },
  },
  params: { id },
}) => {
  const post = postRepository.getOneOrFail(id);

  const isInvalid = !validateContent(content) || !validateTitle(title) || !validateLangId(langId);
  validateOrFail(isInvalid);

  return postRepository.updateOne({ ...post, id, title, content });
};

const patchOne = ({
  req: {
    body: { title, content, langId },
  },
  params: { id },
}) => {
  const post = postRepository.getOneOrFail(id);

  const isEmpty = !content && !title && !langId;
  validateOrFail(isEmpty);

  const newTitle = title || post.title;
  const newContent = content || post.content;
  const newLangId = langId || post.langId;

  const isInvalid = !validateContent(newTitle) || !validateTitle(newContent) || !validateLangId(newLangId);

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
  router.get('/posts/:postId/lang', getLang);
};
