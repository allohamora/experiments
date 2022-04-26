import { Module } from '@nestjs/common';
import { PingGateway } from './ping.gateway';

@Module({
  providers: [PingGateway],
})
export class PingModule {}
