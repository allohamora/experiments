import { IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetUserByIdDto {
  @IsInt()
  @Transform(({ value }) => Number(value))
  id: number;
}
