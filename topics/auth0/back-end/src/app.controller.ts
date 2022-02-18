import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Auth } from './auth.decorator';
import { CurrentUser } from './current-user.decorator';
import { User } from './user.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('public-data')
  public publicData() {
    return this.appService.publicData();
  }

  @Auth()
  @Get('private-data')
  public privateData() {
    return this.appService.privateData();
  }

  @Auth()
  @Get('me')
  public me(@CurrentUser() user: User) {
    return user;
  }
}
