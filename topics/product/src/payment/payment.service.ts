import currency from 'currency.js';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProductService } from 'src/product/product.service';
import { BuyProductDto } from './dto/buy-product.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private productService: ProductService,
    private eventEmitter: EventEmitter2,
  ) {}

  public async buyProduct({ productId, count }: BuyProductDto) {
    const product = await this.productService.getProductById(productId);
    const summ = currency(product.price).multiply(count).toString();

    const order = this.orderRepository.create({ product, summ, count });
    const result = await this.orderRepository.save(order);

    this.eventEmitter.emit('order.paymented', result);

    return result;
  }
}
