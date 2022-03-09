import { Body, Controller, Post } from '@nestjs/common';
import { PurchaseProductDto } from './dto/purchase-product.dto';
import { PurchaseService } from './purchase.service';

@Controller('purchase')
export class PurchaseController {
  constructor(private purchaseService: PurchaseService) {}

  @Post('product')
  public async buyProduct(@Body() purchaseProductDto: PurchaseProductDto) {
    return await this.purchaseService.purchaseProduct(purchaseProductDto);
  }
}
