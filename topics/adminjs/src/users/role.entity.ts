import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { User } from './user.entity';

export enum RoleType {
  User = 'user',
  Admin = 'admin',
  Editor = 'editor',
}

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ enum: RoleType, unique: true })
  type: RoleType;

  @RelationId((role: Role) => role.users)
  usersIds: number[];

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
