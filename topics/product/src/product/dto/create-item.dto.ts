import { IsInt } from 'class-validator';
import { ProductContentDto } from './product-content.dto';

export class CreateItemDto extends ProductContentDto {
  @IsInt()
  id: number;
}
