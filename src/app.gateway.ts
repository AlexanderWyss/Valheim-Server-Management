import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit, SubscribeMessage, MessageBody,
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

  @SubscribeMessage('log')
  handleMessage(): void {
    console.log('client connect log');
  }

  afterInit(): any {
    this.logsSubscription = this.service.subscribeLogs().subscribe(value => {
      console.log(value);
      this.server.emit('log', value);
    });
    this.statusSubscription = this.service.subscribeStatus().subscribe(value => this.server.emit('status', value));
  }
}
