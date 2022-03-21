import { IsString, MaxLength } from 'class-validator';

export class CreateChannelDto {
  @IsString()
  @MaxLength(30)
  name: string;
}
