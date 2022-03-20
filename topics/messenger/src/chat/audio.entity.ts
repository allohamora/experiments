import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Audio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 300 })
  src: string;

  @Column('int')
  length: number;
}
