import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class AppGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: unknown): WsResponse<unknown> {
    this.server.emit('callback', 'Hello All');
    return { event: 'callback', data: 'Hello world!' };
  }
}
