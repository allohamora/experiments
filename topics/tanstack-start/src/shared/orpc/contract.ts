import { oc } from '@orpc/contract';
import { z } from 'zod';

export const healthContract = oc
  .route({
    method: 'GET',
    path: '/health',
    tags: ['Health'],
  })
  .output(
    z.object({
      ok: z.literal(true),
    }),
  );

export const contract = {
  health: healthContract,
};
