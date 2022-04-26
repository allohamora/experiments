import { ApiProperty } from '@nestjs/swagger';

export class PingSubDto {
  @ApiProperty({ example: 'ping' })
  event: 'ping';

  @ApiProperty({ example: 'pong' })
  data: 'pong';
}
