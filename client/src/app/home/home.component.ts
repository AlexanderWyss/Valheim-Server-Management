import { Component, OnInit } from '@angular/core';
import { ClientService } from '../client.service';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  status: string;
  log: string;
  error: string;
  loading: boolean;

  constructor(private client: ClientService, private socket: WebsocketService) {
  }

  ngOnInit(): void {
    this.loadStatus();
    this.loadLogs();
    this.socket.onLog().subscribe(log => this.log += log);
  }

  loadStatus(): void {
    this.client.getStatus().subscribe(status => this.status = this.processText(JSON.stringify(status, null, 4)),
      err => this.handleError(err));
  }

  loadLogs(): void {
    this.client.getLogs().subscribe(log => this.log = this.processText(log), err => this.handleError(err));
  }

  private processText(text: string): string {
    return text.replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/'/g, '&apos;')
      .replace(/\n/g, '<br>');
  }

  start(): void {
    this.loading = true;
    this.client.start().subscribe(() => {
      this.loadingDone();
    }, err => {
      this.handleError(err);
      this.loadingDone();
    });
  }

  private loadingDone() {
    this.loading = false;
    this.loadStatus();
    this.loadLogs();
  }

  stop(): void {
    this.loading = true;
    this.client.stop().subscribe(() => {
      this.loadingDone();
    }, err => {
      this.handleError(err);
      this.loadingDone();
    });
  }

  private handleError(error: any) {
    console.error(error);
    if (error.error && error.error.message) {
      this.error = error.error.message;
    } else {
      this.error = error;
    }
    this.error = new Date().toLocaleString() + ' ' + this.error;
  }
}
