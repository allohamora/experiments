import { IsInt, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { ProductContentDto } from './product-content.dto';

export class CreatePrivilegeDto extends ProductContentDto {
  @IsString()
  @MinLength(5)
  @MaxLength(30)
  role: string;

  @IsInt()
  @Min(1)
  period: number;
}
