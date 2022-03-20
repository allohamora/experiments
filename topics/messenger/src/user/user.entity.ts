import { Chat } from 'src/chat/chat.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
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
}
