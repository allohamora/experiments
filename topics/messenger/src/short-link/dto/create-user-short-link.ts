import { IsString, MaxLength } from 'class-validator';

export class CreateUserShortLinkDto {
  @IsString()
  @MaxLength(30)
  code: string;
}
