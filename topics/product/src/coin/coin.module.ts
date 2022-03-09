import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoinController } from './coin.controller';
import { Coin } from './coin.entity';
import { CoinService } from './coin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Coin])],
  controllers: [CoinController],
  providers: [CoinService],
})
export class CoinModule {}
