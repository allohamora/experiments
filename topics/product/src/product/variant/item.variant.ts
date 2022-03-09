import { isFactory, Product, ProductType } from '../product.entity';

export interface ItemAttributes {
  id: number;
}

export interface Item extends Product {
  type: ProductType.Item;
  attributes: ItemAttributes;
}

export const isItem = isFactory<Item>(ProductType.Item);
