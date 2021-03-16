import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Status } from './_models/Status';
import { Observable } from 'rxjs';
import { getProtocol, getUrl } from './util';

@Injectable({
  providedIn: 'root',
})
export class ClientService {

  private readonly URL = getProtocol() + getUrl() + '/api';

  constructor(private http: HttpClient) {
  }

  getStatus(): Observable<Status> {
    return this.http.get(this.URL + '/status') as Observable<Status>;
  }

  start(): Observable<any> {
    return this.http.post(this.URL + '/start', null);
  }

  stop(): Observable<any> {
    return this.http.post(this.URL + '/stop', null);
  }

  getLogs(): Observable<string> {
    return this.http.get(this.URL + '/logs') as Observable<string>;
  }
}
