import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Auth } from 'src/auth/auth.decorator';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/user/user.entity';
import { ChatService } from './chat.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { CreatePersonalChatDto } from './dto/create-personal-chat.dto';
import { CreatePostChatDto } from './dto/create-post-chat';
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

  @Post('channel')
  @Auth()
  public async createChannel(
    @Body() createChannelDto: CreateChannelDto,
    @CurrentUser() user: User,
  ) {
    return await this.chatService.createChannel(createChannelDto, user);
  }

  @Post('post-chat')
  @Auth()
  public async createPostChat(
    @Body() createPostChatDto: CreatePostChatDto,
    @CurrentUser() user: User,
  ) {
    return await this.chatService.createPostChat(createPostChatDto, user);
  }
}
