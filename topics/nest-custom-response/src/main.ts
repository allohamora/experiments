import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CustomResponseInterceptor } from './shared/interceptors/custom-response.interceptor';

const main = async () => {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Nest custom response')
    .setDescription('experiment')
    .setVersion('0.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.useGlobalInterceptors(new CustomResponseInterceptor());

  await app.listen(3000);
};

main();
