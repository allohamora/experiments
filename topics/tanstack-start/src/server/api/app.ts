import { swaggerUI } from '@hono/swagger-ui';
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';

import { createRequestLog, getHealth, getLogs } from '#/server/api/service';

const api = new OpenAPIHono().basePath('/api');

api.use('*', async (c, next) => {
  const startedAt = Date.now();

  await next();

  try {
    await createRequestLog({
      method: c.req.method,
      path: new URL(c.req.url).pathname,
      status: c.res.status,
      durationMs: Date.now() - startedAt,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to write request log', error);
  }
});

const app = api
  .openapi(
    createRoute({
      method: 'get',
      path: '/health',
      tags: ['Health'],
      responses: {
        200: {
          description: 'Health check',
          content: {
            'application/json': {
              schema: z.object({
                ok: z.literal(true),
                serverSideMessage: z.string(),
              }),
            },
          },
        },
      },
    }),
    async (c) => {
      return c.json(await getHealth(), 200);
    },
  )
  .openapi(
    createRoute({
      method: 'get',
      path: '/logs',
      tags: ['Logs'],
      responses: {
        200: {
          description: 'Recent API request logs',
          content: {
            'application/json': {
              schema: z.object({
                logs: z.array(
                  z.object({
                    id: z.string(),
                    method: z.string(),
                    path: z.string(),
                    status: z.number(),
                    durationMs: z.number(),
                    createdAt: z.string(),
                  }),
                ),
              }),
            },
          },
        },
      },
    }),
    async (c) => {
      return c.json(await getLogs(), 200);
    },
  );

app.doc('/swagger.json', {
  openapi: '3.1.0',
  info: {
    title: 'tanstack-start.topic OpenAPI',
    version: '1.0.0',
  },
  servers: [{ url: '/api' }],
});

app.get('/swagger', swaggerUI({ url: '/api/swagger.json' }));

export type AppType = typeof app;

export default app;
