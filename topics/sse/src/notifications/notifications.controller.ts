import { Body, Controller, Param, Post, Sse } from '@nestjs/common';
import { NotifyDto } from './dto/notify.dto';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Sse(':id')
  public subscribe(@Param('id') id: string) {
    return this.notificationsService.subscribe(id);
  }

  @Post(':id')
  public notify(@Param('id') id: string, @Body() { message }: NotifyDto) {
    return this.notificationsService.notify(id, message);
  }
}
