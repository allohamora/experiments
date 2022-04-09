export const queryParser = (req) => {
  const { url } = req;
  const [, params] = url.split('?');
  const urlSearchParams = new URLSearchParams(params);
  const query = {};

  urlSearchParams.forEach((value, key) => {
    query[key] = value;
  });

  req.query = query;
};
