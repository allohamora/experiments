import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { BETTER_AUTH_SECRET, BETTER_AUTH_URL } from '#/server/config';
import { db } from '#/server/db';
import * as schema from '#/server/db.schema';

export const auth = betterAuth({
  baseURL: BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  secret: BETTER_AUTH_SECRET,
});
