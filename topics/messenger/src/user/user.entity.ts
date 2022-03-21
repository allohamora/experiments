import { Chat } from 'src/chat/chat.entity';
import { Search } from 'src/search/search.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ enum: Role })
  role: Role;

  @ManyToMany(() => Chat, (chat) => chat.users)
  chats: Chat[];

  @Column({ length: 20, unique: true })
  login: string;

  @OneToOne(() => Search, (search) => search.user, { cascade: true })
  search: Search;
}
