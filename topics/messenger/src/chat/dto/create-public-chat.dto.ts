import { IsString, MaxLength } from 'class-validator';

export class CreatePublicChatDto {
  @IsString()
  @MaxLength(30)
  name: string;
}
