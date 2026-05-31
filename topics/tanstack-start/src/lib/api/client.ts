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

export async function getLogs() {
  const response = await honoClient.api.logs.$get();

  if (!response.ok) {
    throw new Error(`GET /api/logs failed with ${response.status}`);
  }

  return response.json();
}
