import { randomUUID } from 'node:crypto';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const requestLogs = sqliteTable('request_logs', {
  id: text().primaryKey().$defaultFn(randomUUID),
  method: text().notNull(),
  path: text().notNull(),
  status: integer().notNull(),
  durationMs: integer().notNull(),
  createdAt: text().notNull(),
});
