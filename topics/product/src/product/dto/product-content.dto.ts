import { IsString, MaxLength, MinLength } from 'class-validator';

export class ProductContentDto {
  @IsString()
  @MaxLength(30)
  name: string;

  @IsString()
  @MaxLength(90)
  description: string;

  @IsString()
  @MinLength(3)
  @MaxLength(10)
  price: string;
}
