import { IsInt, IsString, MaxLength } from 'class-validator';

export class CreateChatShortLinkDto {
  @IsString()
  @MaxLength(30)
  code: string;

  @IsInt()
  chatId: number;
}
