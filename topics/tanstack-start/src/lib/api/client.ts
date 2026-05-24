import { hc } from 'hono/client';

import type { AppType } from '#/server/api/app';

export const honoClient = hc<AppType>('');

export async function getHealth() {
  const response = await honoClient.api.health.$get();

  if (!response.ok) {
    throw new Error(`GET /api/health failed with ${response.status}`);
  }

  return response.json();
}
