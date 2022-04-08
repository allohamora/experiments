const bodyParsers = {
  'application/json': (body) => JSON.parse(body),
  'application/x-www-form-urlencoded': (body) => {
    return body.split('&').reduce((state, keyValue) => {
      const [key, value] = keyValue.split('=');

      state[key] = value;

      return state;
    }, {});
  },
};

const getBody = async (req) => {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks).toString();
};

const parseBody = async (req) => {
  const body = await getBody(req);
  const contentType = req.headers['content-type'];
  const parser = bodyParsers[contentType] ?? ((body) => body);

  return parser(body);
};

export const bodyParser = async (req) => {
  const body = await parseBody(req);

  req.body = body;
};
