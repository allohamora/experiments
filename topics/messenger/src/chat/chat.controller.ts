import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Auth } from 'src/auth/auth.decorator';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/user/user.entity';
import { ChatService } from './chat.service';
import { CreatePersonalChatDto } from './dto/create-personal-chat.dto';
import { CreatePublicChatDto } from './dto/create-public-chat.dto';
import { GetChatDto } from './dto/get-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get(':id')
  @Auth()
  public async getChat(@Param() { id }: GetChatDto, @CurrentUser() user: User) {
    return await this.chatService.getChatById(id, user);
  }

  @Post('send-message')
  @Auth()
  public async sendMessage(
    @Body() sendMessageDto: SendMessageDto,
    @CurrentUser() user: User,
  ) {
    return await this.chatService.sendMessage(sendMessageDto, user);
  }

  @Post('personal')
  @Auth()
  public async createPersonalChat(
    @Body() createPersonalChatDto: CreatePersonalChatDto,
    @CurrentUser() user: User,
  ) {
    return await this.chatService.createPersonalChat(
      createPersonalChatDto,
      user,
    );
  }

  @Post('public')
  @Auth()
  public async createPublicChat(
    @Body() createPublicChatDto: CreatePublicChatDto,
    @CurrentUser() user: User,
  ) {
    return await this.chatService.createPublicChat(createPublicChatDto, user);
  }
}
