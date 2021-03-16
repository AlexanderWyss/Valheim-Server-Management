import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  constructor(private socket: Socket) {
    this.socket.on('connect', () => {
      this.socket.fromEvent('callback').subscribe((val: any) => {
        console.log(val);
      });
      this.socket.emit('message');
    });
  }
}
