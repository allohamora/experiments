import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Audio } from './audio.entity';
import { Chat } from './chat.entity';
import { Image } from './image.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Chat, (chat) => chat.messages)
  chat: Chat;

  @Column({ length: 3000, nullable: true })
  text?: string;

  @OneToOne(() => Image, { nullable: true, cascade: true })
  @JoinColumn()
  image?: Image;

  @OneToOne(() => Audio, { nullable: true, cascade: true })
  @JoinColumn()
  audio?: Audio;

  @ManyToOne(() => User)
  sender: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
