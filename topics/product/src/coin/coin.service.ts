import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from 'src/event.enum';
import { Repository } from 'typeorm';
import { Coin } from './coin.entity';
import { CreateCoinDto } from './dto/create-coin.dto';

@Injectable()
export class CoinService {
  constructor(
    @InjectRepository(Coin)
    private coinRepository: Repository<Coin>,
  ) {}

  public async getCoins() {
    return this.coinRepository.find();
  }

  public async createCoin(createCoinDto: CreateCoinDto) {
    const coin = this.coinRepository.create(createCoinDto);

    return await this.coinRepository.save(coin);
  }

  @OnEvent(Event.CoinPurchased)
  public async handleCoinPurchased(coin: Coin, count: number) {
    console.log({ message: 'coin purchased', coin, count });
  }
}
