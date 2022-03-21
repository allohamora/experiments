import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatService } from 'src/chat/chat.service';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { CreateChatShortLinkDto } from './dto/create-chat-short-link';
import { CreateUserShortLinkDto } from './dto/create-user-short-link';
import { GetByShortLinkDto } from './dto/get-by-short-link';
import { ShortLink, ShortLinkType } from './short-link.entity';
import { ChatType } from 'src/chat/chat.entity';

@Injectable()
export class ShortLinkService {
  constructor(
    @InjectRepository(ShortLink)
    private shortLinkRepository: Repository<ShortLink>,
    private chatService: ChatService,
  ) {}

  public async createUserShortLink(
    { code }: CreateUserShortLinkDto,
    user: User,
  ) {
    const shortLink = this.shortLinkRepository.create({
      code,
      user,
      type: ShortLinkType.User,
    });

    return await this.shortLinkRepository.save(shortLink);
  }

  public async createChatShortLink(
    { code, chatId }: CreateChatShortLinkDto,
    user: User,
  ) {
    const chat = await this.chatService.getChatById(chatId, user);

    if (chat.type !== ChatType.Public && chat.type !== ChatType.Channel) {
      throw new BadRequestException('invalid chatIdd');
    }

    const shortLink = this.shortLinkRepository.create({
      code,
      chat,
      type: ShortLinkType.Chat,
    });

    return await this.shortLinkRepository.save(shortLink);
  }

  public async getByShortLink({ code }: GetByShortLinkDto) {
    return await this.shortLinkRepository.findOneOrFail({
      relations: ['user', 'chat'],
      where: { code },
    });
  }
}
