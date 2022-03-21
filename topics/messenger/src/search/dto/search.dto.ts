import { IsString, MaxLength } from 'class-validator';

export class SearchDto {
  @IsString()
  @MaxLength(30)
  name: string;
}
