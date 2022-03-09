import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoinDto } from './dto/create-coin.dto';
import { CreatePrivilegeDto } from './dto/create-privelege.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { ProductContentDto } from './dto/product-content.dto';
import { Product, ProductType } from './product.entity';
import { Coin, CoinAttributes, isCoin } from './variant/coin.variant';
import {
  isPrivilege,
  Privilege,
  PrivilegeAttributes,
} from './variant/privilege.variant';
import { isItem, Item, ItemAttributes } from './variant/item.variant';
import { OnEvent } from '@nestjs/event-emitter';
import { Order } from 'src/payment/order.entity';

interface CreateProductDto extends ProductContentDto {
  type: ProductType;
  attributes: unknown;
}

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  public async getProductById(id: number) {
    return await this.productRepository.findOneOrFail(id);
  }

  public async getProducts() {
    return await this.productRepository.find();
  }

  private async createAndSaveProduct({
    type,
    name,
    description,
    price,
    attributes,
  }: CreateProductDto) {
    const token = this.productRepository.create({
      type,
      name,
      description,
      price,
      attributes,
    });

    return await this.productRepository.save(token);
  }

  public async createCoin({ id, ...base }: CreateCoinDto) {
    const attributes: CoinAttributes = { id };

    return await this.createAndSaveProduct({
      type: ProductType.Coin,
      attributes,
      ...base,
    });
  }

  public async createItem({ id, ...base }: CreateItemDto) {
    const attributes: ItemAttributes = { id };

    return await this.createAndSaveProduct({
      type: ProductType.Item,
      attributes,
      ...base,
    });
  }

  public async createPrivilege({ role, period, ...base }: CreatePrivilegeDto) {
    const attributes: PrivilegeAttributes = { role, period };

    return await this.createAndSaveProduct({
      type: ProductType.Privilege,
      attributes,
      ...base,
    });
  }

  @OnEvent('order.paymented')
  public async handleOrderPaymented({ product, count }: Order) {
    if (isPrivilege(product)) {
      return await this.applyPrivilege(product, count);
    } else if (isItem(product)) {
      return await this.applyItem(product, count);
    } else if (isCoin(product)) {
      return await this.applyCoin(product, count);
    }

    console.warn(`unknown product`, product);
  }

  private async applyPrivilege(privilege: Privilege, count: number) {
    console.log(`privilege applied`, { privilege, count });
  }

  private async applyItem(item: Item, count: number) {
    console.log(`item applied`, { item, count });
  }

  private async applyCoin(coin: Coin, count: number) {
    console.log(`coint applied`, { coin, count });
  }
}
