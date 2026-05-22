import { createRouterClient } from '@orpc/server';

import { router } from '#/server/orpc/router';

export const orpcClient = createRouterClient(router);
