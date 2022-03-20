import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';

export class GetChatDto {
  @IsInt()
  @Transform(({ value }) => Number(value))
  id: number;
}
