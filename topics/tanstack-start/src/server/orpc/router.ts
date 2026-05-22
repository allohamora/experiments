import { implement } from '@orpc/server';

import { contract } from '#/shared/orpc/contract';

const os = implement(contract);

export const router = {
  health: os.health.handler(async () => ({ ok: true })),
};
