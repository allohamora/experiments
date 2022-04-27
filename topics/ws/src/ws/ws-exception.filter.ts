import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { WebSocket } from 'ws';

@Catch(WsException)
export class WsExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    super.catch(exception, host);

    const client = host.switchToWs().getClient<WebSocket>();
    const status = 'error';
    const message = exception?.getError() || 'Internal server error';

    client.send(
      JSON.stringify({ event: 'exception', data: { status, message } }),
    );
  }
}
