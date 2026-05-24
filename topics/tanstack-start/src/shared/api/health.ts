import { createIsomorphicFn } from '@tanstack/react-start';

export type HealthResponse = {
  ok: true;
};

export const getHealth = createIsomorphicFn()
  .server(async () => {
    const { getHealth } = await import('#/server/api/service');

    return getHealth();
  })
  .client(async () => {
    const { getHealth } = await import('#/lib/api/client');

    return getHealth();
  });
