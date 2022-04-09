import { HttpError, Message, StatusCode } from '../utils/http.js';

let lastId = 0;

function* idGeneratorFactory() {
  while (true) {
    yield ++lastId;
  }
}

const idGenerator = idGeneratorFactory();
const nextId = () => idGenerator.next().value;

let postList = [
  {
    id: nextId(),
    title: 'first post',
    content: 'post about war between cats and dogs',
  },
];

let langList = [
  {
    id: nextId(),
    text: 'English',
    code: 'en',
  },
];

const postsLangs = new Map();
postsLangs.set(postList[0].id, [langList[0].id]);

const getLangs = (postId) => {
  const parsedId = Number(postId);
  if (!postsLangs.has(parsedId)) {
    throw new HttpError({ message: Message.NotFound, statusCode: StatusCode.NotFound });
  }

  const langIds = postsLangs.get(parsedId);
  return langIds.map((id) => langList.find((lang) => lang.id === id));
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

const getAllLangs = ({ reply, params: { postId } }) => {
  const langs = getLangs(postId);

  reply({ data: langs });
};

const getOneLang = ({ reply, params: { postId, id } }) => {
  const lang = findLangOrFail({ postId, id });

  reply({ data: lang });
};

const getAll = ({ reply }) => {
  reply({ data: postList });
};

const findByIdOrFail = (id) => {
  const found = postList.find((post) => post.id === Number(id));

  if (!found) {
    throw new HttpError({ message: Message.NotFound, StatusCode: StatusCode.NotFound });
  }

  return found;
};

const validateOrFail = (isInvalid) => {
  if (isInvalid) {
    throw new HttpError({ message: Message.BadRequest, StatusCode: StatusCode.BadRequest });
  }
};

const getOne = ({ reply, params: { id } }) => {
  const found = findByIdOrFail(id);

  reply({ data: found });
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

  const post = {
    id: nextId(),
    title,
    content,
  };

  postList.push(post);

  reply({ statusCode: StatusCode.Created, data: post });
};

const updateOne = ({
  reply,
  req: {
    body: { title, content },
  },
  params: { id },
}) => {
  const found = findByIdOrFail(id);

  const isInvalid = !validateContent(content) || !validateTitle(title);
  validateOrFail(isInvalid);

  found.title = title;
  found.content = content;

  reply({ data: found });
};

const patchOne = ({
  reply,
  req: {
    body: { title, content },
  },
  params: { id },
}) => {
  const found = findByIdOrFail(id);

  const isEmpty = !content && !title;
  validateOrFail(isEmpty);

  const newTitle = title || found.title;
  const newContent = content || found.content;

  const isInvalid = !validateContent(newTitle) || !validateTitle(newContent);

  validateOrFail(isInvalid);

  found.title = newTitle;
  found.content = newContent;

  reply({ data: found });
};

const deleteOne = ({ reply, params: { id } }) => {
  const found = findByIdOrFail(id);

  postList = postList.filter((post) => post.id === id);

  reply({ data: found });
};

export const posts = ({ router }) => {
  router.get('/posts', getAll);
  router.get('/posts/:id', getOne);
  router.post('/posts', createOne);
  router.put('/posts/:id', updateOne);
  router.patch('/posts/:id', patchOne);
  router.delete('/posts/:id', deleteOne);

  // for nested entities
  // I don’t see the point in duplicating all routes, the meaning is already clear
  router.get('/posts/:postId/langs', getAllLangs);
  router.get('/posts/:postId/langs/:id', getOneLang);
};
