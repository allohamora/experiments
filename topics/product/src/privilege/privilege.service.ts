import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from 'src/event.enum';
import { Repository } from 'typeorm';
import { CreatePrivilegeDto } from './dto/create-privilege.dto';
import { Privilege } from './privilege.entity';

@Injectable()
export class PrivilegeService {
  constructor(
    @InjectRepository(Privilege)
    private privilegeRepository: Repository<Privilege>,
  ) {}

  public async getPrivileges() {
    return await this.privilegeRepository.find();
  }

  public async createPrivilege(createPrivilegeDto: CreatePrivilegeDto) {
    const privilege = this.privilegeRepository.create(createPrivilegeDto);

    return await this.privilegeRepository.save(privilege);
  }

  @OnEvent(Event.PrivilegePurchased)
  public async handlePrivilegePurchased(privilege: Privilege, count: number) {
    console.log({ message: 'privilege purchased', privilege, count });
  }
}
