import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AppService } from './app.service';
import { Subscription } from 'rxjs';

@WebSocketGateway()
export class AppGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  logsSubscription: Subscription;
  statusSubscription: Subscription;

  constructor(private readonly service: AppService) {
  }

  afterInit(): any {
    this.logsSubscription = this.service.subscribeLogs().subscribe(value => {
      console.log('subscriber: ' + value);
      this.server.emit('log', value);
    });
    this.statusSubscription = this.service.subscribeStatus().subscribe(value => this.server.emit('status', value));
  }
}
