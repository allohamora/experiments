import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public async getUsers() {
    return await this.userRepository.find();
  }

  public async getUserById(id: number) {
    return await this.userRepository.findOneOrFail(id);
  }
}
