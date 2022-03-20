import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 300 })
  src: string;

  @Column({ length: 30 })
  alt: string;
}
