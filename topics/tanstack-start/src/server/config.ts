import 'dotenv/config';
import { z } from 'zod';

export const { BETTER_AUTH_SECRET, BETTER_AUTH_URL, DB_FILE_NAME, SERVER_SIDE_MESSAGE } = z
  .object({
    BETTER_AUTH_SECRET: z.string().default('dev-only-better-auth-secret-change-me'),
    BETTER_AUTH_URL: z.string().default('http://localhost:3000'),
    DB_FILE_NAME: z.string().default('.temp/data.db'),
    SERVER_SIDE_MESSAGE: z.string().default('Only available on the server'),
  })
  .parse(process.env);
