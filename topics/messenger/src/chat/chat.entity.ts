import { Search } from 'src/search/search.entity';
import { ShortLink } from 'src/short-link/short-link.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Message } from './message.entity';

export enum ChatType {
  Public = 'public',
  Personal = 'personal',
  Channel = 'channel',
  ChannelPost = 'channelPost',
}

export const CHAT_TABLE_NAME = 'chat';
export const CHAT_ID_COLUMN = 'id';
export const CHAT_TYPE_COLUMN = 'type';

export const USERS_CHAT_TABLE = 'chat_users';
export const USERS_CHAT_CHATID_COLUMN = 'chat';
export const USERS_CHAT_USERID_COLUMN = 'user';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn({ name: CHAT_ID_COLUMN })
  id: number;

  @Column({ enum: ChatType, name: CHAT_TYPE_COLUMN })
  type: ChatType;

  @Column({ length: 30, nullable: true })
  name?: string;

  @OneToMany(() => Message, (message) => message.chat)
  @JoinColumn()
  messages: Message[];

  @ManyToMany(() => User, (user) => user.chats)
  @JoinTable({
    name: USERS_CHAT_TABLE,
    joinColumn: {
      name: USERS_CHAT_CHATID_COLUMN,
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: USERS_CHAT_USERID_COLUMN,
      referencedColumnName: 'id',
    },
  })
  users: User[];

  @OneToOne(() => Message, (message) => message.postChat, { nullable: true })
  post?: Message;

  @OneToOne(() => Search, (search) => search.chat, { cascade: true })
  search?: Search;

  @ManyToOne(() => User)
  creator: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => ShortLink, (shortLink) => shortLink.chat, { nullable: true })
  shortLink?: ShortLink;
}
