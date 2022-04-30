import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiOkResponse } from '@shared/swagger';
import { HiDto } from './dto/hi.dto';
import { HiService } from './hi.service';

@ApiTags('Hi')
@Controller('hi')
export class HiController {
  constructor(private hiService: HiService) {}

  @Get()
  @ApiOkResponse({ type: HiDto, description: 'Returns hi message' })
  public hi() {
    return this.hiService.hi();
  }
}
