import http from 'http';
import findMyWay from 'find-my-way';

const PORT = 3000;

const ContentType = {
  Json: 'application/json',
  FormUrlencoded: 'application/x-www-form-urlencoded',
};

const StatuCode = {
  Ok: 200,
};

const router = findMyWay();

router.post('/post', async (req, res) => {
  console.log(req.body);

  res.setHeader('content-type', ContentType.Json);
  res.statusCode = StatuCode.Ok;
  res.end(JSON.stringify(req.body));
});

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

  req.body = parser(body);
};

const server = http.createServer(async (req, res) => {
  await parseBody(req);
  router.lookup(req, res);
});

server.listen(PORT, () => console.log(`server started at ${PORT} port`));
