import { createIsomorphicFn } from '@tanstack/react-start';

export const getApi = createIsomorphicFn()
  .server(async () => {
    const { orpcClient } = await import('#/server/orpc/client');

    return orpcClient;
  })
  .client(async () => {
    const { orpcClient } = await import('#/lib/orpc/client');

    return orpcClient;
  });
