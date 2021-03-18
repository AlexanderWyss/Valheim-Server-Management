import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  constructor(private socket: Socket) {
    this.socket.connect();
  }

  public onLog(): Observable<string> {
    return this.socket.fromEvent('log');
  }
}
