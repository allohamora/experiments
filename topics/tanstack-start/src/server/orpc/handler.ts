import { OpenAPIHandler } from '@orpc/openapi/fetch';
import { OpenAPIReferencePlugin } from '@orpc/openapi/plugins';
import { onError } from '@orpc/server';
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4';
import { fromWebHandler } from 'nitro/h3';

import { router } from '#/server/orpc/router';

const openApiHandler = new OpenAPIHandler(router, {
  plugins: [
    new OpenAPIReferencePlugin({
      docsProvider: 'swagger',
      docsPath: '/swagger',
      specPath: '/swagger.json',
      schemaConverters: [new ZodToJsonSchemaConverter()],
      specGenerateOptions: {
        info: {
          title: 'tanstack-start.topic OpenAPI',
          version: '1.0.0',
        },
        servers: [{ url: '/api' }],
      },
    }),
  ],
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

export default fromWebHandler(async (request) => {
  const { response } = await openApiHandler.handle(request, {
    prefix: '/api',
    context: {},
  });

  return response ?? new Response('Not Found', { status: 404 });
});
