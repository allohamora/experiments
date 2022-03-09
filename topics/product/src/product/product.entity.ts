import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ProductType {
  Privilege = 'Privilege',
  Item = 'Item',
  Coin = 'Coin',
}

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ enum: ProductType })
  type: ProductType;

  @Column({ length: 30 })
  name: string;

  @Column({ length: 90 })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: string;

  @Column({ type: 'jsonb' })
  attributes: unknown;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export const isFactory =
  <T extends Product>(type: ProductType) =>
  (product: Product): product is T =>
    product.type === type;
