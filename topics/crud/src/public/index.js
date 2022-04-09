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

const langId = {
  ...id,
  name: 'langId'
};

const forms = [
  {
    fields: [],
    name: 'Get all posts',
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
    fields: [required(title), required(content), langId],
    name: 'Create one post',
    method: Method.Post, 
    route: '/posts',
    bodyType: BodyType.Json
  },
  {
    fields: [required(id), required(title), required(content), langId],
    name: 'Update (replace) one post',
    method: Method.Put,
    route: '/posts/:id',
    bodyType: BodyType.Json
  },
  {
    fields: [required(id), title, content, langId],
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
    name: 'Get nested lang',
    method: Method.Get,
    route: '/posts/:postId/lang',
    bodyType: BodyType.Text
  },
  {
    fields: [postId],
    name: 'Get all langs not nested',
    method: Method.Get,
    route: '/langs',
    bodyType: BodyType.Text
  }
];

forms.forEach(renderForm);
app.classList.add('app--active');