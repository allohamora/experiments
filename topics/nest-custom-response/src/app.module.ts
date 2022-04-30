import { Module } from '@nestjs/common';
import { PingModule } from './ping/ping.module';
import { HiModule } from './hi/hi.module';

@Module({
  imports: [PingModule, HiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
