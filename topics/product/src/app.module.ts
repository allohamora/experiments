import ormConfig from '../ormconfig';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { PaymentModule } from './payment/payment.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    ProductModule,
    PaymentModule,
    EventEmitterModule.forRoot(),
  ],
})
export class AppModule {}
