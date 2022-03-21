import { Module } from '@nestjs/common';
import { ShortLinkService } from './short-link.service';
import { ShortLinkController } from './short-link.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShortLink } from './short-link.entity';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [TypeOrmModule.forFeature([ShortLink]), ChatModule],
  providers: [ShortLinkService],
  controllers: [ShortLinkController],
})
export class ShortLinkModule {}
