import { createIsomorphicFn } from '@tanstack/react-start';

export type AuthState =
  | {
      status: 'signed in';
      user: {
        id: string;
        email: string;
        name: string;
      };
      session: {
        id: string;
        expiresAt: string;
      };
    }
  | {
      status: 'signed out';
      user: null;
      session: null;
    };

type RawAuthSession = {
  user: {
    id: string;
    email: string;
    name: string;
  };
  session: {
    id: string;
    expiresAt: Date | string;
  };
};

function toAuthState(session: RawAuthSession | null | undefined): AuthState {
  if (!session) {
    return {
      status: 'signed out',
      user: null,
      session: null,
    };
  }

  return {
    status: 'signed in',
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    },
    session: {
      id: session.session.id,
      expiresAt:
        session.session.expiresAt instanceof Date ? session.session.expiresAt.toISOString() : session.session.expiresAt,
    },
  };
}

export const getAuthState = createIsomorphicFn()
  .server(async () => {
    const { getRequestHeaders } = await import('@tanstack/react-start/server');
    const { auth } = await import('#/server/auth');

    return toAuthState(await auth.api.getSession({ headers: getRequestHeaders() }));
  })
  .client(async () => {
    const { authClient } = await import('#/lib/auth/client');
    const { data } = await authClient.getSession();

    return toAuthState(data);
  });
