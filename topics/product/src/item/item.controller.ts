import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemService } from './item.service';

@Controller('item')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Get()
  public async getItems() {
    return await this.itemService.getItems();
  }

  @Post('create-item')
  public async createItem(@Body() createItemDto: CreateItemDto) {
    return await this.itemService.createItem(createItemDto);
  }
}
