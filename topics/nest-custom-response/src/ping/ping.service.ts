import { Injectable } from '@nestjs/common';

@Injectable()
export class PingService {
  public ping() {
    return 'pong';
  }
}
