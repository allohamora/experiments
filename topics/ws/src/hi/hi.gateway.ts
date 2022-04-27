import { UseFilters } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { AsyncApiPub, AsyncApiService } from 'nestjs-asyncapi';
import { WsExceptionFilter } from 'src/ws/ws-exception.filter';
import { WsValidationPipe } from 'src/ws/ws-validation.pipe';
import { WsService } from 'src/ws/ws.service';
import { HiDto } from './dto/hi.dto';
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
  @UseFilters(WsExceptionFilter)
  public hi(@MessageBody(WsValidationPipe) { userId }: HiDto) {
    const data = this.hiService.hi(userId);

    this.wsService.send(userId, { event: 'hi', data });
  }
}
