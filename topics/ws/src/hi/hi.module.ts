import { Module } from '@nestjs/common';
import { WsModule } from 'src/ws/ws.module';
import { HiGateway } from './hi.gateway';
import { HiService } from './hi.service';

@Module({
  imports: [WsModule],
  providers: [HiService, HiGateway],
})
export class HiModule {}
