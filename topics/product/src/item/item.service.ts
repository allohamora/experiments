import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from 'src/event.enum';
import { Repository } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { Item } from './item.entity';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) {}

  public async getItems() {
    return await this.itemRepository.find();
  }

  public async createItem(createItemDto: CreateItemDto) {
    const item = this.itemRepository.create(createItemDto);

    return this.itemRepository.save(item);
  }

  @OnEvent(Event.ItemPurchased)
  public async handleItemPurchased(item: Item, count: number) {
    console.log({ message: 'item purchased', item, count });
  }
}
