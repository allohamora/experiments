import { Body, Controller, Get, Post } from '@nestjs/common';
import { CoinService } from './coin.service';
import { CreateCoinDto } from './dto/create-coin.dto';

@Controller('coin')
export class CoinController {
  constructor(private coinService: CoinService) {}

  @Get()
  public async getCoins() {
    return await this.coinService.getCoins();
  }

  @Post('create-coin')
  public async createCoin(@Body() createCoinDto: CreateCoinDto) {
    return await this.coinService.createCoin(createCoinDto);
  }
}
