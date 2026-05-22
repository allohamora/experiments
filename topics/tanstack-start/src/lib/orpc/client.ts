import { createORPCClient } from '@orpc/client';
import { OpenAPILink } from '@orpc/openapi-client/fetch';
import type { ContractRouterClient } from '@orpc/contract';
import type { JsonifiedClient } from '@orpc/openapi-client';

import { contract } from '#/shared/orpc/contract';

export type AppOrpcClient = JsonifiedClient<ContractRouterClient<typeof contract>>;

export const orpcClient = createORPCClient(
  new OpenAPILink(contract, {
    url: 'http://localhost:3000/api',
  }),
) as AppOrpcClient;
