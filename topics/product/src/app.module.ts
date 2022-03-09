import ormConfig from '../ormconfig';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { PurchaseModule } from './purchase/purchase.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CoinModule } from './coin/coin.module';
import { PrivilegeModule } from './privilege/privilege.module';
import { ItemModule } from './item/item.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    ProductModule,
    PurchaseModule,
    EventEmitterModule.forRoot(),
    CoinModule,
    PrivilegeModule,
    ItemModule,
  ],
})
export class AppModule {}
