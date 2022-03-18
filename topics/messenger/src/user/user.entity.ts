import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ enum: Role })
  role: Role;

  @Column({ length: 20, unique: true })
  login: string;
}
