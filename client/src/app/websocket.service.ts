import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {

  constructor(private socket: Socket) {
  }

  public onLog(): Observable<string> {
    return this.socket.fromEvent('log');
  }
}
