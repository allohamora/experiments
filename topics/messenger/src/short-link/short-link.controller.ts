import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Auth } from 'src/auth/auth.decorator';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/user/user.entity';
import { CreateChatShortLinkDto } from './dto/create-chat-short-link';
import { CreateUserShortLinkDto } from './dto/create-user-short-link';
import { GetByShortLinkDto } from './dto/get-by-short-link';
import { ShortLinkService } from './short-link.service';

@Controller('short-link')
export class ShortLinkController {
  constructor(private shortLinkService: ShortLinkService) {}

  @Get(':code')
  public async getByShortLink(@Param() getByShortLinkDto: GetByShortLinkDto) {
    return await this.shortLinkService.getByShortLink(getByShortLinkDto);
  }

  @Post('user')
  @Auth()
  public async createUserShortLink(
    @Body() createUserShortLinkDto: CreateUserShortLinkDto,
    @CurrentUser() user: User,
  ) {
    return await this.shortLinkService.createUserShortLink(
      createUserShortLinkDto,
      user,
    );
  }

  @Post('chat')
  @Auth()
  public async createChatShortLink(
    @Body() createChatShortLink: CreateChatShortLinkDto,
    @CurrentUser() user: User,
  ) {
    return await this.shortLinkService.createChatShortLink(
      createChatShortLink,
      user,
    );
  }
}
