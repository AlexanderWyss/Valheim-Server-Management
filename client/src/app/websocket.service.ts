import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { Status } from './_models/Status';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {

  constructor(private socket: Socket) {
  }

  public onLog(): Observable<string> {
    return this.socket.fromEvent('log');
  }
  public onStatus(): Observable<Status> {
    return this.socket.fromEvent('status');
  }
}
