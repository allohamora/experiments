import { IsInt } from 'class-validator';

export class BuyProductDto {
  @IsInt()
  productId: number;

  @IsInt()
  count: number;
}
