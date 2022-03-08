import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import ormConfig from '../ormconfig';

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), ProductModule],
})
export class AppModule {}
