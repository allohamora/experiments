import { app } from "./app.js";
import { renderForm, Method, BodyType } from "./form.js";

const required = (field) => ({ ...field, required: true });

const title = {
  name: 'title',
  type: 'text'
};

const content = {
  name: 'content',
  type: 'text'
};

const id = {
  name: 'id',
  type: 'number',
  min: 1,
};

const postId = {
  ...id,
  name: 'postId'
};

const forms = [
  {
    fields: [],
    name: 'Get All posts',
    method: Method.Get,
    route: '/posts',
    bodyType: BodyType.Text
  },
  {
    fields: [required(id)],
    name: 'Get one post',
    method: Method.Get,
    route: '/posts/:id',
    bodyType: BodyType.Text
  },
  { 
    fields: [required(title), required(content)],
    name: 'Create one post',
    method: Method.Post, 
    route: '/posts',
    bodyType: BodyType.Json
  },
  {
    fields: [required(id), required(title), required(content)],
    name: 'Update (replace) one post',
    method: Method.Put,
    route: '/posts/:id',
    bodyType: BodyType.Json
  },
  {
    fields: [required(id), title, content],
    name: 'Partial update one post',
    method: Method.Patch,
    route: '/posts/:id',
    bodyType: BodyType.Json
  },
  {
    fields: [required(id)],
    name: 'Delete one post',
    method: Method.Delete,
    route: '/posts/:id',
    bodyType: BodyType.Json
  },
  {
    fields: [required(postId)],
    name: 'Get All langs nested',
    method: Method.Get,
    route: '/posts/:postId/langs',
    bodyType: BodyType.Text
  },
  {
    fields: [required(postId), required(id)],
    name: 'Get one langs nested',
    method: Method.Get,
    route: '/posts/:postId/langs/:id',
    bodyType: BodyType.Text
  },
  {
    fields: [postId],
    name: 'Get All langs not nested',
    method: Method.Get,
    route: '/langs',
    bodyType: BodyType.Text
  },
  {
    fields: [required(id)],
    name: 'Get one lang not nested',
    method: Method.Get,
    route: '/langs/:id',
    bodyType: BodyType.Text
  }
];

forms.forEach(renderForm);
app.classList.add('app--active');