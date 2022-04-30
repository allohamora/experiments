import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomResponseInterceptor } from './shared/interceptors/custom-response.interceptor';

const main = async () => {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new CustomResponseInterceptor());

  await app.listen(3000);
};

main();
