import { ApiProperty } from '@nestjs/swagger';

export class Response<Data> {
  @ApiProperty()
  status: boolean;

  data: Data;
}

export class SuccessResponse<Data> {
  @ApiProperty({ default: true })
  status: true;

  data: Data;
}

export class ExceptionResponse {
  @ApiProperty({ default: false })
  status: false;
}
