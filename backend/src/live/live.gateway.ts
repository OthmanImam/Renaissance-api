import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { Logger } from '@nestjs/common';
import { UpdateMatchDto } from './dto/update-match.dto';

@WebSocketGateway({ path: '/live', transports: ['websocket'] })
export class LiveGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(LiveGateway.name);
  // simple connection pool: Set of WebSocket clients
  private clients = new Set<WebSocket>();

  handleConnection(client: WebSocket) {
    this.clients.add(client);
    this.logger.log(`Client connected (total=${this.clients.size})`);

    client.on('message', (data) => {
      // No-op: server is push-first. Optionally accept subscriptions.
      this.logger.debug(`Received message from client: ${data}`);
    });

    client.on('close', () => {
      this.clients.delete(client);
      this.logger.log(`Client disconnected (total=${this.clients.size})`);
    });
  }

  handleDisconnect(client: WebSocket) {
    this.clients.delete(client);
    this.logger.log(`Client disconnected (total=${this.clients.size})`);
  }

  broadcastMatchUpdate(update: UpdateMatchDto) {
    const payload = JSON.stringify({ type: 'match:update', data: update });
    for (const client of this.clients) {
      try {
        if (client.readyState === client.OPEN) {
          client.send(payload);
        }
      } catch (e) {
        this.logger.warn('Failed to send to a client, removing');
        this.clients.delete(client);
      }
    }
  }
}
