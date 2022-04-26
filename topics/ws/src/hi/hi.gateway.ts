import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { AsyncApiPub, AsyncApiService } from 'nestjs-asyncapi';
import { WsService } from 'src/ws/ws.service';
import { HiPubDto } from './dto/hi.pub.dto';
import { HiService } from './hi.service';

@AsyncApiService()
@WebSocketGateway()
export class HiGateway {
  constructor(private hiService: HiService, private wsService: WsService) {}

  @AsyncApiPub({
    channel: 'hi',
    message: {
      name: 'hi pub dto',
      payload: {
        type: HiPubDto,
      },
    },
    tags: [{ name: 'main' }],
  })
  @SubscribeMessage('hi')
  public hi(@MessageBody() { userId }: { userId: string }) {
    if (!userId) {
      throw new WsException('validation failed');
    }

    const data = this.hiService.hi(userId);

    this.wsService.send(userId, { event: 'hi', data });
  }
}
