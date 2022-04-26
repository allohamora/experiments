import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { interval, map } from 'rxjs';

@WebSocketGateway({ path: '/ping' })
export class PingGateway {
  @SubscribeMessage('interval')
  interval() {
    return interval(1000).pipe(map(() => ({ event: 'ping', data: 'pong' })));
  }
}
