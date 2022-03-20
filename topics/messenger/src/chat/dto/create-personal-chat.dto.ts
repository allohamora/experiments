import { IsInt } from 'class-validator';

export class CreatePersonalChatDto {
  @IsInt()
  targetUserId: number;
}
