import { fromWebHandler } from 'nitro/h3';

import app from '#/server/api/app';

export default fromWebHandler(async (request) => {
  return app.fetch(request);
});
