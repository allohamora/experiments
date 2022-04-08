import { Message, StatusCode } from '../utils/http.js';

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

const getOne = ({ reply, params: { id } }) => {
  const found = postsList.find((post) => post.id === Number(id));

  if (!found) {
    reply({ status: StatusCode.NotFound, data: Message.NotFound });
    return;
  }

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
  if (!validateContent(content) || !validateTitle(title)) {
    reply({ status: StatusCode.BadRequest, data: StatusCode.BadRequest });
    return;
  }

  const post = {
    id: nextId(),
    title,
    content,
  };

  postsList.push(post);

  reply({ status: StatusCode.Created, data: post });
};

const updateOne = ({
  reply,
  req: {
    body: { title, content },
  },
  params: { id },
}) => {
  const found = postsList.find((post) => post.id === Number(id));

  if (!found) {
    reply({ status: StatusCode.NotFound, data: Message.NotFound });
    return;
  }

  if (!validateContent(content) || !validateTitle(title)) {
    reply({ status: StatusCode.BadRequest, data: StatusCode.BadRequest });
    return;
  }

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
  const found = postsList.find((post) => post.id === Number(id));

  if (!found) {
    reply({ status: StatusCode.NotFound, data: Message.NotFound });
    return;
  }

  if (!content || !title) {
    reply({ status: StatusCode.BadRequest, data: StatusCode.BadRequest });
    return;
  }

  const newTitle = title ?? found.title;
  const newContent = content ?? found.content;

  if (!validateContent(newTitle) || !validateTitle(newContent)) {
    reply({ status: StatusCode.BadRequest, data: StatusCode.BadRequest });
    return;
  }

  found.title = newTitle;
  found.content = newContent;

  reply({ data: found });
};

const deleteOne = ({ reply, params: { id } }) => {
  const found = postsList.find((post) => post.id === Number(id));

  if (!found) {
    reply({ status: StatusCode.NotFound, data: Message.NotFound });
    return;
  }

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
