import { ApiProperty } from '@nestjs/swagger';

export class HiDto {
  @ApiProperty({ example: 'hi' })
  message: string;
}
