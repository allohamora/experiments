import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiOkResponse } from '@shared/swagger';
import { PingService } from './ping.service';

@ApiTags('Ping')
@Controller('ping')
export class PingController {
  constructor(private pingService: PingService) {}

  @Get()
  @ApiOkResponse({ description: 'ping response' })
  public ping() {
    return this.pingService.ping();
  }
}
