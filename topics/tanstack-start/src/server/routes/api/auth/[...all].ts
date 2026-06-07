import { fromWebHandler } from 'nitro/h3';

import { auth } from '#/server/auth';

export default fromWebHandler((request) => {
  return auth.handler(request);
});
