import { Module } from '@nestjs/common';
import { HiController } from './hi.controller';
import { HiService } from './hi.service';

@Module({
  controllers: [HiController],
  providers: [HiService],
})
export class HiModule {}
