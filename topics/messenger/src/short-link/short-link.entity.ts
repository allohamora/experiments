import { Chat } from 'src/chat/chat.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ShortLinkType {
  User = 'user',
  Chat = 'chat',
}

@Entity()
export class ShortLink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ enum: ShortLinkType })
  type: ShortLinkType;

  @Column({ length: 30, unique: true })
  code: string;

  @OneToOne(() => User, (user) => user.shortLink, { nullable: true })
  @JoinColumn()
  user?: User;

  @OneToOne(() => Chat, (chat) => chat.shortLink, { nullable: true })
  @JoinColumn()
  chat?: Chat;
}
