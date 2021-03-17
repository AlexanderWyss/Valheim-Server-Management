import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Client, Server } from 'socket.io';
import { AppService } from './app.service';
import { Subscription } from 'rxjs';

@WebSocketGateway()
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  clientIds: string[] = [];
  logsSubscription: Subscription;
  statusSubscription: Subscription;

  constructor(private readonly service: AppService) {
  }

  handleConnection(client: Client, ...args: any[]): any {
    this.clientIds.push(client.id);
    if (!this.logsSubscription) {
      this.logsSubscription = this.service.subscribeLogs().subscribe(value => this.server.emit('log', value));
    }
    if (!this.statusSubscription) {
      this.statusSubscription = this.service.subscribeStatus().subscribe(value => this.server.emit('status', value));
    }
  }

  handleDisconnect(client: Client): any {
    const index = this.clientIds.indexOf(client.id);
    if (index !== -1) {
      this.clientIds.splice(index, 1);
    }
    if (this.clientIds.length === 0) {
      this.logsSubscription.unsubscribe();
      this.logsSubscription = null;
      this.statusSubscription.unsubscribe();
      this.statusSubscription = null;
    }
  }
}
