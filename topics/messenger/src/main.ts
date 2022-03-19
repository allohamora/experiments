import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { EntityNotFoundExceptionFilter } from './filters/entity-not-found-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter());

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new EntityNotFoundExceptionFilter());

  await app.listen(3000);
}
bootstrap();
