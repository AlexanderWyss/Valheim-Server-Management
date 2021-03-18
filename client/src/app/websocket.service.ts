import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  constructor(private socket: Socket) {
    console.log('try connect');
    this.socket.on('connect', () => {
      console.log('connected');
      this.socket.emit('log');
    });
    this.socket.connect();
  }

  public onLog(): Observable<string> {
    return this.socket.fromEvent('log');
  }
}
