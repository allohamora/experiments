import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { WsService } from 'src/ws/ws.service';
import { HiService } from './hi.service';

@WebSocketGateway()
export class HiGateway {
  constructor(private hiService: HiService, private wsService: WsService) {}

  @SubscribeMessage('hi')
  public hi(@MessageBody() { userId }: { userId: string }) {
    if (!userId) {
      throw new WsException('validation failed');
    }

    const data = this.hiService.hi(userId);

    this.wsService.send(userId, { event: 'hi', data });
  }
}
