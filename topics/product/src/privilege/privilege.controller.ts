import { Controller, Get, Post } from '@nestjs/common';
import { CreatePrivilegeDto } from './dto/create-privilege.dto';
import { PrivilegeService } from './privilege.service';

@Controller('privilege')
export class PrivilegeController {
  constructor(private privilegeService: PrivilegeService) {}

  @Get()
  public async getPrivileges() {
    return await this.privilegeService.getPrivileges();
  }

  @Post('create-privilege')
  public async createPrivilege(createPrivilegeDto: CreatePrivilegeDto) {
    return await this.privilegeService.createPrivilege(createPrivilegeDto);
  }
}
