import { Product } from 'src/product/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  summ: string;

  @Column()
  count: number;

  @ManyToOne(() => Product)
  product: Product;
}
