import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateCoinDto } from './dto/create-coin.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { CreatePrivilegeDto } from './dto/create-privelege.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  public async getProducts() {
    return await this.productService.getProducts();
  }

  @Post('create-coin')
  public async createCoin(@Body() createTokenDto: CreateCoinDto) {
    return await this.productService.createCoin(createTokenDto);
  }

  @Post('create-item')
  public async createItem(@Body() createItemDto: CreateItemDto) {
    return await this.productService.createItem(createItemDto);
  }

  @Post('create-privilege')
  public async createPrivilege(@Body() createPrivilegeDto: CreatePrivilegeDto) {
    return await this.productService.createPrivilege(createPrivilegeDto);
  }
}
