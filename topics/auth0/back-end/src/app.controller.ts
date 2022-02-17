import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('public-data')
  public publicData() {
    return this.appService.publicData();
  }

  @UseGuards(AuthGuard)
  @Get('private-data')
  public privateData() {
    return this.appService.privateData();
  }
}
