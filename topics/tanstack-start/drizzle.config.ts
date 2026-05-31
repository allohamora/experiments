import { defineConfig } from 'drizzle-kit';
import { DB_FILE_NAME } from './src/server/config';

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/server/db.schema.ts',
  // Drizzle Kit defaults `out` to "./drizzle".
  casing: 'snake_case',
  dbCredentials: {
    url: DB_FILE_NAME,
  },
});
