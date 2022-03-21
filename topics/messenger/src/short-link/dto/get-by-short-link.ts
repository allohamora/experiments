import { IsString, MaxLength } from 'class-validator';

export class GetByShortLinkDto {
  @IsString()
  @MaxLength(30)
  code: string;
}
