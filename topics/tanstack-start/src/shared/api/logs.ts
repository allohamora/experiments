import { createIsomorphicFn } from '@tanstack/react-start';

export type RequestLog = {
  id: string;
  method: string;
  path: string;
  status: number;
  durationMs: number;
  createdAt: string;
};

export type LogsResponse = {
  logs: RequestLog[];
};

export const getLogs = createIsomorphicFn()
  .server(async () => {
    const { getLogs } = await import('#/server/api/service');

    return getLogs();
  })
  .client(async () => {
    const { getLogs } = await import('#/lib/api/client');

    return getLogs();
  });
