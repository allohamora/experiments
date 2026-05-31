import path from 'node:path';

import { drizzle } from 'drizzle-orm/node-sqlite';
import { migrate } from 'drizzle-orm/node-sqlite/migrator';

import { DB_FILE_NAME } from '#/server/config';
import * as schema from '#/server/db.schema';

// Drizzle Kit defaults `out` to "./drizzle".
const MIGRATIONS_DIR = path.join(import.meta.dirname, '..', '..', 'drizzle');

export const db = drizzle(DB_FILE_NAME, { casing: 'snake_case', schema });

migrate(db, { migrationsFolder: MIGRATIONS_DIR });
