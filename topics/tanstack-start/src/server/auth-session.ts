import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

import { auth } from '#/server/auth';

export async function getSessionFromHeaders(headers: Headers) {
  return auth.api.getSession({ headers });
}

export async function requireSessionFromHeaders(headers: Headers) {
  const session = await getSessionFromHeaders(headers);

  if (!session) {
    throw new Error('Unauthorized');
  }

  return session;
}

export const getSession = createServerFn({ method: 'GET' }).handler(async () => {
  return getSessionFromHeaders(getRequestHeaders());
});

export const requireSession = createServerFn({ method: 'GET' }).handler(async () => {
  return requireSessionFromHeaders(getRequestHeaders());
});
