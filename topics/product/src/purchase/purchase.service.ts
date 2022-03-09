import currency from 'currency.js';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProductService } from 'src/product/product.service';
import { PurchaseProductDto } from './dto/purchase-product.dto';
import { Event } from 'src/event.enum';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private productService: ProductService,
    private eventEmitter: EventEmitter2,
  ) {}

  public async purchaseProduct({ productId, count }: PurchaseProductDto) {
    const product = await this.productService.getProductById(productId);
    const summ = currency(product.price).multiply(count).toString();

    const order = this.orderRepository.create({ product, summ, count });
    const result = await this.orderRepository.save(order);

    this.eventEmitter.emit(Event.ProductPurchased, result);

    return result;
  }
}
