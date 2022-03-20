import { IsString, MaxLength } from 'class-validator';

export class CreateImageDto {
  @IsString()
  @MaxLength(300)
  src: string;

  @IsString()
  @MaxLength(30)
  alt: string;
}
