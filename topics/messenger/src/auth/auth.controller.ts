import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { CurrentUser } from './current-user.decorator';
import { IdGuard } from './id.guard';

@Controller('auth')
export class AuthController {
  @Get('test')
  @UseGuards(IdGuard)
  public async test(@CurrentUser() user: User) {
    return user;
  }
}
