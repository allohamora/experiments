import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { Audio } from './audio.entity';
import { ChatController } from './chat.controller';
import { Chat } from './chat.entity';
import { ChatService } from './chat.service';
import { Image } from './image.entity';
import { Message } from './message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat, Message, Audio, Image]),
    UserModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
