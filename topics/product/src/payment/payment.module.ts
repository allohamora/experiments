import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from 'src/product/product.module';
import { Order } from './order.entity';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [ProductModule, TypeOrmModule.forFeature([Order])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
