import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';

import { getHealth } from '#/server/api/service';

const app = new OpenAPIHono().basePath('/api').openapi(
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
            }),
          },
        },
      },
    },
  }),
  async (c) => {
    return c.json(await getHealth(), 200);
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
