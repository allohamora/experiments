import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { isCoin } from 'src/coin/coin.entity';
import { isPrivilege } from 'src/privilege/privilege.entity';
import { isItem } from 'src/item/item.entity';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Order } from 'src/purchase/order.entity';
import { Event } from 'src/event.enum';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private eventEmitter: EventEmitter2,
  ) {}

  public async getProductById(id: number) {
    return await this.productRepository.findOneOrFail(id);
  }

  public async getProducts() {
    return await this.productRepository.find();
  }

  @OnEvent(Event.ProductPurchased)
  public async handleOrderPaymented({ product, count }: Order) {
    if (isPrivilege(product)) {
      return this.eventEmitter.emit(Event.PrivilegePurchased, product, count);
    } else if (isItem(product)) {
      return this.eventEmitter.emit(Event.ItemPurchased, product, count);
    } else if (isCoin(product)) {
      return this.eventEmitter.emit(Event.CoinPurchased, product, count);
    }

    console.warn('unknown product', product);
  }
}
