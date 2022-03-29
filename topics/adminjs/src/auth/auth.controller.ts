import { Controller, Get } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { Auth } from './auth.decorator';
import { CurrentUser } from './current-user.decorator';

@Controller('auth')
export class AuthController {
  @Get('me')
  @Auth()
  public getMe(@CurrentUser() user: User) {
    return user;
  }
}
