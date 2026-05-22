import { os } from '@orpc/server';
import { z } from 'zod';

const health = os
  .route({
    method: 'GET',
    path: '/health',
    tags: ['Health'],
  })
  .output(
    z.object({
      ok: z.literal(true),
    }),
  )
  .handler(async () => ({ ok: true }));

export const router = {
  health,
};
