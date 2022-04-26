import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { AsyncApiService, AsyncApiSub } from 'nestjs-asyncapi';
import { interval, map } from 'rxjs';
import { PingSubDto } from './dto/ping.sub.dto';

@AsyncApiService()
@WebSocketGateway({ path: '/ping' })
export class PingGateway {
  @AsyncApiSub({
    channel: 'interval',
    message: {
      name: 'ping sub dto',
      payload: {
        type: PingSubDto,
      },
    },
    tags: [{ name: 'ping' }],
  })
  @SubscribeMessage('interval')
  interval() {
    return interval(1000).pipe(map(() => ({ event: 'ping', data: 'pong' })));
  }
}
