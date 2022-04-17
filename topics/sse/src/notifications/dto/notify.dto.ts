import { IsString, MinLength } from 'class-validator';

export class NotifyDto {
  @IsString()
  @MinLength(3)
  message: string;
}
