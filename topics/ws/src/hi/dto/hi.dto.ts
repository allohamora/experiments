import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class HiDto {
  @ApiProperty({ example: '1' })
  @IsString()
  userId: string;
}
