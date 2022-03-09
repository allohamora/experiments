import { isFactory, Product, ProductType } from 'src/product/product.entity';
import { ChildEntity, Column } from 'typeorm';

@ChildEntity(ProductType.Item)
export class Item extends Product {
  @Column()
  inGameId: number;
}

export const isItem = isFactory<Item>(ProductType.Item);
