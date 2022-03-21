import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { SearchDto } from './dto/search.dto';
import { Search } from './search.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Search)
    private searchRepository: Repository<Search>,
  ) {}

  public async search({ name }: SearchDto) {
    return await this.searchRepository.find({
      relations: ['user', 'chat'],
      where: {
        name: ILike(name),
      },
    });
  }
}
