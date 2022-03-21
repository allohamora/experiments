import { Controller, Get, Query } from '@nestjs/common';
import { Auth } from 'src/auth/auth.decorator';
import { SearchDto } from './dto/search.dto';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  @Auth()
  public async search(@Query() searchDto: SearchDto) {
    return await this.searchService.search(searchDto);
  }
}
