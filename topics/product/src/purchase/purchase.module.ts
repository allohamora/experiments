import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from 'src/product/product.module';
import { Order } from './order.entity';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';

@Module({
  imports: [ProductModule, TypeOrmModule.forFeature([Order])],
  controllers: [PurchaseController],
  providers: [PurchaseService],
})
export class PurchaseModule {}
