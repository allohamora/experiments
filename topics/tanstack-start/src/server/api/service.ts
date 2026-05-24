import type { HealthResponse } from '#/shared/api/health';

export async function getHealth(): Promise<HealthResponse> {
  return { ok: true };
}
