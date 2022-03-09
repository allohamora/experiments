import { isFactory, Product, ProductType } from '../product.entity';

export interface CoinAttributes {
  id: string;
}

export interface Coin extends Product {
  type: ProductType.Coin;
  attributes: CoinAttributes;
}

export const isCoin = isFactory<Coin>(ProductType.Coin);
