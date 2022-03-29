import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30, unique: true })
  login: string;

  @Column({ length: 30, unique: true })
  password: string;

  @Column({ enum: Role })
  role: Role;
}
