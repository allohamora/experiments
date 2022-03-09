import { Product, ProductType, isFactory } from 'src/product/product.entity';
import { ChildEntity, Column } from 'typeorm';

@ChildEntity(ProductType.Coin)
export class Coin extends Product {
  @Column({ length: 10 })
  currency: string;
}

export const isCoin = isFactory<Coin>(ProductType.Coin);
