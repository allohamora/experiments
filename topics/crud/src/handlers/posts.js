import { HttpError, Message, StatusCode } from '../utils/http.js';

let lastId = 1;
let postsList = [
  {
    id: lastId,
    title: 'first post',
    content: 'post about war between cats and dogs',
  },
];

function* idGeneratorFactory() {
  while (true) {
    yield ++lastId;
  }
}

const idGenerator = idGeneratorFactory();
const nextId = () => idGenerator.next().value;

const getAll = ({ reply }) => {
  reply({ data: postsList });
};

const findByIdOrFail = (id) => {
  const found = postsList.find((post) => post.id === Number(id));

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

  postsList.push(post);

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

  postsList = postsList.filter((post) => post.id === id);

  reply({ data: found });
};

export const posts = ({ router }) => {
  router.get('/posts', getAll);
  router.get('/posts/:id', getOne);
  router.post('/posts', createOne);
  router.put('/posts/:id', updateOne);
  router.patch('/posts/:id', patchOne);
  router.delete('/posts/:id', deleteOne);
};
