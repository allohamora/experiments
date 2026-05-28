import {
  HttpApi,
  HttpApiBuilder,
  HttpApiEndpoint,
  HttpApiGroup,
  HttpApiSwagger,
  HttpMiddleware,
} from '@effect/platform';
import { NodeHttpServer, NodeRuntime } from '@effect/platform-node';
import { Effect, Layer, Schema } from 'effect';
import { createServer } from 'node:http';

const NumberResponse = Schema.Struct({
  number: Schema.Number,
});

const MyApi = HttpApi.make('MyApi').add(
  HttpApiGroup.make('Routes')
    .add(HttpApiEndpoint.get('root', '/').addSuccess(Schema.String))
    .add(
      HttpApiEndpoint.get('getNumber', '/:number')
        .setPath(
          Schema.Struct({
            number: Schema.NumberFromString,
          }),
        )
        .addSuccess(NumberResponse),
    ),
);

const RoutesLive = HttpApiBuilder.group(MyApi, 'Routes', (handlers) =>
  handlers
    .handle('root', () => Effect.succeed('Hello, World!'))
    .handle('getNumber', ({ path: { number } }) => Effect.succeed({ number })),
);

const MyApiLive = HttpApiBuilder.api(MyApi).pipe(Layer.provide(RoutesLive));

const ServerLive = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  Layer.provide(HttpApiSwagger.layer({ path: '/swagger' })),
  Layer.provide(MyApiLive),
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 })),
  Layer.tap(() => Effect.log('Started server at http://localhost:3000')),
);

Layer.launch(ServerLive).pipe(NodeRuntime.runMain);
