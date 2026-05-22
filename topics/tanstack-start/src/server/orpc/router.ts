import { os } from '@orpc/server';

const health = os.handler(async () => ({ ok: true }));

export const router = {
  health,
};
