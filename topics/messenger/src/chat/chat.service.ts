import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Search, SearchContentType } from 'src/search/search.entity';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Connection, Repository } from 'typeorm';
import { Audio } from './audio.entity';
import {
  Chat,
  ChatType,
  USERS_CHAT_CHATID_COLUMN,
  CHAT_TABLE_NAME,
  USERS_CHAT_TABLE,
  USERS_CHAT_USERID_COLUMN,
  CHAT_ID_COLUMN,
  CHAT_TYPE_COLUMN,
} from './chat.entity';
import { CreateAudioDto } from './dto/create-audio.dto';
import { CreateChannelDto } from './dto/create-channel.dto';
import { CreateImageDto } from './dto/create-image.dto';
import { CreatePersonalChatDto } from './dto/create-personal-chat.dto';
import { CreatePostChatDto } from './dto/create-post-chat';
import { CreatePublicChatDto } from './dto/create-public-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { Image } from './image.entity';
import { Message, MessageType } from './message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Audio)
    private audioRepository: Repository<Audio>,
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
    @InjectConnection()
    private connection: Connection,
    private userService: UserService,
  ) {}

  public async getChatById(id: number, user: User) {
    const chat = await this.chatRepository.findOneOrFail(id, {
      relations: ['users', 'messages', 'post'],
    });
    const isPersonal = chat.type === ChatType.Personal;
    const isChatMember = chat.users.some(({ id }) => user.id === id);

    if (isPersonal && !isChatMember) {
      throw new BadRequestException("user doesn't have access to that chat");
    }

    return chat;
  }

  private isUserNotHaveAccessToChat(chat: Chat, user: User) {
    if (chat.type === ChatType.Channel) {
      return chat.creator.id !== user.id;
    }

    return !chat.users.some(({ id }) => id === user.id);
  }

  private async createAndSaveMessage(
    sender: User,
    chat: Chat,
    text?: string,
    audio?: CreateAudioDto,
    image?: CreateImageDto,
  ) {
    if (!text && !audio && !image) {
      throw new BadRequestException('message should have at least one content');
    }

    const data: {
      text?: string;
      audio?: Audio;
      image?: Image;
      type?: MessageType;
    } = {};

    if (chat.type === ChatType.Channel) {
      data.type = MessageType.Post;
    }

    if (text) {
      data.text = text;
    }

    if (audio) {
      data.audio = this.audioRepository.create(audio);
    }

    if (image) {
      data.image = this.imageRepository.create(image);
    }

    return await this.connection.transaction(async (transactionManager) => {
      const message = this.messageRepository.create({ ...data, sender, chat });
      const saved = await transactionManager.save(message);

      chat.updatedAt = new Date();
      await transactionManager.save(chat);

      return saved;
    });
  }

  public async sendMessage(
    { chatId, text, audio, image }: SendMessageDto,
    user: User,
  ) {
    const chat = await this.chatRepository.findOneOrFail(chatId, {
      relations: ['users', 'creator'],
    });

    if (this.isUserNotHaveAccessToChat(chat, user)) {
      throw new ForbiddenException("user doesn't have access to that chat");
    }

    return await this.createAndSaveMessage(user, chat, text, audio, image);
  }

  private async getTargetUser(id: number) {
    try {
      return await this.userService.getUserById(id);
    } catch (error) {
      throw new BadRequestException('target user is not exists');
    }
  }

  private async personalChatAlreadyExistsCheck(targetUser: User, user: User) {
    if (user.id === targetUser.id) {
      throw new BadRequestException("can't create personal chat with yourself");
    }

    const findPersonalChatQuery = `
      SELECT cu.${USERS_CHAT_CHATID_COLUMN} as id FROM ${USERS_CHAT_TABLE} cu
      LEFT JOIN ${CHAT_TABLE_NAME} c ON c.${CHAT_ID_COLUMN} = cu.${USERS_CHAT_CHATID_COLUMN}
      WHERE c.${CHAT_TYPE_COLUMN} = $1
      GROUP BY cu.${USERS_CHAT_CHATID_COLUMN}, c.${CHAT_TYPE_COLUMN}
      HAVING $2 = ANY(array_agg(cu.${USERS_CHAT_USERID_COLUMN})) 
      AND $3 = ANY(array_agg(cu.${USERS_CHAT_USERID_COLUMN}))
      LIMIT 1
    `;

    const [chat] = (await this.connection.query(findPersonalChatQuery, [
      ChatType.Personal,
      user.id,
      targetUser.id,
    ])) as {
      id: number;
    }[];

    if (chat) {
      throw new BadRequestException('chat already exists');
    }
  }

  public async createPersonalChat(
    { targetUserId }: CreatePersonalChatDto,
    user: User,
  ) {
    const targetUser = await this.getTargetUser(targetUserId);
    await this.personalChatAlreadyExistsCheck(targetUser, user);

    const chat = this.chatRepository.create({
      type: ChatType.Personal,
      users: [targetUser, user],
      creator: user,
    });

    return await this.chatRepository.save(chat);
  }

  public async createChannel({ name }: CreateChannelDto, creator: User) {
    const search = new Search();
    search.name = name;
    search.type = SearchContentType.Channel;

    const channel = this.chatRepository.create({
      creator,
      name,
      users: [creator],
      type: ChatType.Channel,
      search,
    });

    return await this.chatRepository.save(channel);
  }

  public async createPostChat({ postId }: CreatePostChatDto, creator: User) {
    const message = await this.messageRepository.findOneOrFail(postId, {
      relations: ['postChat'],
    });

    if (message.postChat !== null || message.type !== MessageType.Post) {
      throw new BadRequestException('invalid postId');
    }

    const postChat = this.chatRepository.create({
      type: ChatType.ChannelPost,
      creator,
      users: [creator],
      post: message,
    });

    return await this.chatRepository.save(postChat);
  }

  public async createPublicChat({ name }: CreatePublicChatDto, user: User) {
    const search = new Search();
    search.name = name;
    search.type = SearchContentType.Chat;

    const chat = this.chatRepository.create({
      type: ChatType.Public,
      name,
      users: [user],
      creator: user,
      search: search,
    });

    return await this.chatRepository.save(chat);
  }
}
