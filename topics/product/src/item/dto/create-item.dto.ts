import { IsInt } from 'class-validator';
import { ProductContentDto } from 'src/product/dto/product-content.dto';

export class CreateItemDto extends ProductContentDto {
  @IsInt()
  inGameId: number;
}
