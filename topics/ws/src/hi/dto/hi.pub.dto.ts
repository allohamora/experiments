import { ApiProperty } from '@nestjs/swagger';

export class HiPubDto {
  @ApiProperty({ example: 'hi' })
  event: 'hi';

  @ApiProperty({ example: 'hi 123!' })
  data: string;
}
