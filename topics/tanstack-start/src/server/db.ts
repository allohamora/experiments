import path from 'node:path';

import { drizzle } from 'drizzle-orm/node-sqlite';
import { migrate } from 'drizzle-orm/node-sqlite/migrator';

import { DB_FILE_NAME } from '#/server/config';
import * as schema from '#/server/db.schema';

// Drizzle Kit defaults `out` to "./drizzle".
// import.meta.dirname has other value in the prerender step
// https://github.com/TanStack/router/discussions/7518
const MIGRATIONS_DIR = path.join(process.cwd(), 'drizzle');

export const db = drizzle(DB_FILE_NAME, { casing: 'snake_case', schema });

migrate(db, { migrationsFolder: MIGRATIONS_DIR });
