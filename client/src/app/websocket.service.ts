import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  constructor(private socket: Socket) {
    this.socket.on('connect', () => {
      console.log('connect');
      this.socket.fromEvent('log').subscribe((val: any) => {
        console.log(val);
      });
    });
  }
}
