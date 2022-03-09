import { IsInt } from 'class-validator';

export class PurchaseProductDto {
  @IsInt()
  productId: number;

  @IsInt()
  count: number;
}
