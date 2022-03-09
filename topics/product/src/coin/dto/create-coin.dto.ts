import { IsString, MaxLength, MinLength } from 'class-validator';
import { ProductContentDto } from 'src/product/dto/product-content.dto';

export class CreateCoinDto extends ProductContentDto {
  @IsString()
  @MinLength(0)
  @MaxLength(10)
  currency: string;
}
