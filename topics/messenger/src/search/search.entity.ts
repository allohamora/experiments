import { Chat } from 'src/chat/chat.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum SearchContentType {
  Chat = 'chat',
  User = 'user',
}

@Entity()
export class Search {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ enum: SearchContentType })
  type: SearchContentType;

  @Column({ length: 30 })
  name: string;

  @OneToOne(() => Chat, (chat) => chat.search, { nullable: true })
  @JoinColumn()
  chat?: Chat;

  @OneToOne(() => User, (user) => user.search, { nullable: true })
  @JoinColumn()
  user?: User;
}
