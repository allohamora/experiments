import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Auth } from './auth/auth.decorator';
import { CurrentUser } from './auth/current-user.decorator';
import { Permision } from './auth/permission.enum';
import { User } from './auth/user.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('public-data')
  public publicData() {
    return this.appService.publicData();
  }

  @Auth({ permissions: [Permision.readPrivateData] })
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
