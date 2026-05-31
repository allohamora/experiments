import { desc } from 'drizzle-orm';

import { db } from '#/server/db';
import { requestLogs } from '#/server/db.schema';
import type { HealthResponse } from '#/shared/api/health';
import type { LogsResponse } from '#/shared/api/logs';

export async function getHealth(): Promise<HealthResponse> {
  return { ok: true };
}

type CreateRequestLogInput = {
  method: string;
  path: string;
  status: number;
  durationMs: number;
  createdAt: string;
};

export async function createRequestLog(input: CreateRequestLogInput): Promise<void> {
  await db.insert(requestLogs).values(input);
}

export async function getLogs(): Promise<LogsResponse> {
  const logs = await db.select().from(requestLogs).orderBy(desc(requestLogs.createdAt)).limit(100);

  return { logs };
}
