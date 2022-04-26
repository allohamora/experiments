import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';
import { HiModule } from './hi/hi.module';
import { PingModule } from './ping/ping.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    HiModule,
    PingModule,
  ],
})
export class AppModule {}
