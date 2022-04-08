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

const forms = [
  {
    fields: [],
    name: 'Get All',
    method: Method.Get,
    route: '/posts',
    bodyType: BodyType.Text
  },
  {
    fields: [required(id)],
    name: 'Get one',
    method: Method.Get,
    route: '/posts/:id',
    bodyType: BodyType.Text
  },
  { 
    fields: [required(title), required(content)],
    name: 'Create one',
    method: Method.Post, 
    route: '/posts',
    bodyType: BodyType.Json
  },
  {
    fields: [required(id), required(title), required(content)],
    name: 'Update (replace) one',
    method: Method.Put,
    route: '/posts/:id',
    bodyType: BodyType.Json
  },
  {
    fields: [required(id), title, content],
    name: 'Partial update one',
    method: Method.Patch,
    route: '/posts/:id',
    bodyType: BodyType.Json
  },
  {
    fields: [required(id)],
    name: 'Delete one',
    method: Method.Delete,
    route: '/posts/:id',
    bodyType: BodyType.Json
  }
];

forms.forEach(renderForm);
app.classList.add('app--active');