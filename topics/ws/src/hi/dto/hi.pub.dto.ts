import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { HiDto } from './hi.dto';

export class HiPubDto {
  @ApiProperty({ example: 'hi' })
  event: 'hi';

  @ApiProperty()
  @Type(() => HiDto)
  data: HiDto;
}
