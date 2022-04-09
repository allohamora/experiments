import { forms, setResult } from "./app.js";

const createInputs = (fields) => {
  if (fields.length === 0) {
    const placeholder = document.createElement('div');
    placeholder.innerText = 'Without parameters';

    return [placeholder];
  }

  return fields.map(params => {
    const label = document.createElement('label');
    const input = document.createElement('input');
    Object.assign(input, params);

    const { required, name } = params;

    const nameContainer = document.createElement('div');
    nameContainer.innerText = required ? `${name}*` : name;

    label.append(nameContainer);
    label.append(input);

    return label;
  })
};

export const Method = {
  Get: 'GET',
  Post: 'POST',
  Put: 'PUT',
  Patch: 'PATCH',
  Delete: 'DELETE'
};

export const BodyType = {
  Json: 'application/json',
  Text: 'text/plain'
};

const serializers = {
  [BodyType.Json]: (body) => JSON.stringify(body),
  [BodyType.Text]: (body) => new URLSearchParams(body).toString()
}

const createFieldSet = ({ children, name, method, route }) => {
  const fieldSet = document.createElement('fieldset');
  const legend = document.createElement('legend');

  fieldSet.append(legend, ...children);

  legend.innerText = `${name} (${method}:${route})`;

  return fieldSet;
}

const createSubmitButton = () => {
  const submitButon = document.createElement('button');
  submitButon.innerText = 'submit';
  submitButon.type = 'submit';

  return submitButon;
}

const parseForm = (form) => {
  const formData = new FormData(form);
  const data = {};

  formData.forEach((key, value) => data[value] = key);

  return data;
};

const fillUrl = ({ route, data }) => {
  let url = route;
  const body = {...data};

  for (const key in body) {
    const isInUrl = new RegExp(`:${key}`).test(url);

    if (isInUrl) {
      url = url.replace(`:${key}`, body[key]);
      delete body[key];
    }

    if (body[key] === '') {
      delete body[key];
    }
  }

  return { url, body };
}

const serializeBody = ({ bodyType, body }) => {
  const serialize = serializers[bodyType] ?? serializers[BodyType.Text];
  
  return serialize(body);
}

const request = async ({ url, method, contentType, body }) => {
  const fetchOptions = { method, headers: { 'Content-Type': contentType }, body };

  if (method === Method.Get) {
    delete fetchOptions.body;

    const searchParams = new URLSearchParams(body);
    url = `${url}?${searchParams.toString()}`;
  }

  const res = await fetch(url, fetchOptions);

  return await res.text();
}

const submitHandler = ({ method, route, bodyType }) => async (e) => {
  e.preventDefault();

  const data = parseForm(e.target);
  const { url, body } = fillUrl({ route, data });
  const serializedBody = serializeBody({ bodyType, body });

  const response = await request({ url, method, contentType: bodyType, body: serializedBody });
  
  setResult(response);
}

const createForm = ({ children, method, route, bodyType = BodyType.Json }) => {
  const form = document.createElement('form');

  form.setAttribute('data-method', method);
  form.setAttribute('data-route', route);
  form.setAttribute('data-body-type', bodyType);

  form.append(...children);

  form.addEventListener('submit', submitHandler({ method, route, bodyType }));

  return form;
}

export const renderForm = ({ fields, name, method, route, bodyType }) => {
  const inputs = createInputs(fields);
  const submitButton = createSubmitButton();
  const fieldSet = createFieldSet({ children: [...inputs, submitButton], name, method, route });
  const form = createForm({ method, route, bodyType, children: [fieldSet] });

  forms.append(form);
};