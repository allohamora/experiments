import { Injectable } from '@nestjs/common';
import { WsResponse } from '@nestjs/websockets';
import { WsGateway } from './ws.gateway';

@Injectable()
export class WsService {
  constructor(private wsGateway: WsGateway) {}

  public send<T>(userId: string, message: WsResponse<T>) {
    this.wsGateway.send<T>(userId, message);
  }
}
