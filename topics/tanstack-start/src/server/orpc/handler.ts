import { onError } from '@orpc/server';
import { RPCHandler } from '@orpc/server/fetch';
import { fromWebHandler } from 'nitro/h3';

import { router } from '#/server/orpc/router';

const handler = new RPCHandler(router, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

export default fromWebHandler(async (request) => {
  const { response } = await handler.handle(request, {
    prefix: '/rpc',
    context: {},
  });

  return response ?? new Response('Not Found', { status: 404 });
});
