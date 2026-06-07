import 'dotenv/config';
import { z } from 'zod';

export const { DB_FILE_NAME, SERVER_SIDE_MESSAGE } = z
  .object({
    DB_FILE_NAME: z.string().default('.temp/data.db'),
    SERVER_SIDE_MESSAGE: z.string().default('Only available on the server'),
  })
  .parse(process.env);
