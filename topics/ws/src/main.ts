import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import {
  AsyncApiDocumentBuilder,
  AsyncApiModule,
  AsyncServerObject,
} from 'nestjs-asyncapi';

const main = async () => {
  const app = await NestFactory.create(AppModule);

  app.useWebSocketAdapter(new WsAdapter(app));

  const main: AsyncServerObject = {
    url: 'ws://localhost:3000',
    protocol: 'websocket',
    description: 'Main websocket server',
  };

  const ping: AsyncServerObject = {
    url: 'ws://localhost:3000/ping',
    protocol: 'websocket',
    description: 'Ping websocket route',
  };

  const asyncApiOptions = new AsyncApiDocumentBuilder()
    .setTitle('Ws experiment')
    .setDescription('Ws experiment with asyncapi')
    .setVersion('0.0')
    .setDefaultContentType('application/json')
    .addServer('main', main)
    .addServer('ping', ping)
    .build();

  const asyncapiDocument = AsyncApiModule.createDocument(app, asyncApiOptions);
  await AsyncApiModule.setup('/async-api', app, asyncapiDocument);

  await app.listen(3000);
};

main();
