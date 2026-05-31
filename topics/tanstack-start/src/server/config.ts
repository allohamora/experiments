import 'dotenv/config';
import { z } from 'zod';

export const { DB_FILE_NAME } = z
  .object({
    DB_FILE_NAME: z.string().default('.temp/data.db'),
  })
  .parse(process.env);
