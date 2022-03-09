import { Body, Controller, Post } from '@nestjs/common';
import { BuyProductDto } from './dto/buy-product.dto';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('buy-product')
  public async buyProduct(@Body() buyProductDto: BuyProductDto) {
    return await this.paymentService.buyProduct(buyProductDto);
  }
}
