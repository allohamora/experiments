import { WebSocketGateway, WsResponse } from '@nestjs/websockets';
import { OnGatewayConnection } from '@nestjs/websockets';
import { IncomingMessage } from 'http';
import { WebSocket } from 'ws';

// only gateways can be implements OnGateway hooks
// if app doesn't have at least one gateway it won't listen ws server
@WebSocketGateway()
export class WsGateway implements OnGatewayConnection {
  private connections = new Map<string, WebSocket[]>();

  public send<T>(userId: string, message: WsResponse<T>) {
    const connections = this.connections.get(userId) || [];

    for (const connection of connections) {
      connection.send(JSON.stringify(message));
    }
  }

  public handleConnection(client: WebSocket, message: IncomingMessage) {
    const params = new URLSearchParams(message.url.replace('/', ''));
    const userId = params.get('userId');

    if (!userId) {
      client.send(JSON.stringify({ event: 'unauthorized' }));
      client.close();
    }

    const connections = this.connections.get(userId) || [];

    this.connections.set(userId, [...connections, client]);

    client.on('close', () => {
      const filtered = this.connections
        .get(userId)
        .filter((connection) => client !== connection);

      if (filtered.length === 0) {
        this.connections.delete(userId);
      } else {
        this.connections.set(userId, filtered);
      }
    });
  }
}
