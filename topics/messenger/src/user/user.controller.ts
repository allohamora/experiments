import { Controller, Get, Param } from '@nestjs/common';
import { GetUserByIdDto } from './dto/get-user-by-id.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/')
  public async getUsers() {
    return await this.userService.getUsers();
  }

  @Get('/:id')
  public async getUserById(@Param() { id }: GetUserByIdDto) {
    return await this.userService.getUserById(id);
  }
}
