import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ClientService } from '../client.service';
import { WebsocketService } from '../websocket.service';
import { Status } from '../_models/Status';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('logContainer') private logContainer: ElementRef;
  status: string;
  statusDate: string;
  log: string;
  logDate: string;
  error: string;
  loading: boolean;

  constructor(private client: ClientService, private socket: WebsocketService) {
  }

  ngOnInit(): void {
    this.loadStatus();
    this.socket.onStatus().subscribe(status => this.setStatus(status));
    this.loadLogs();
    this.socket.onLog().subscribe(log => {
      this.log = this.log + this.processText(log);
      this.logUpdate();
    });
  }


  loadStatus(): void {
    this.client.getStatus().subscribe(status => this.setStatus(status),
      err => this.handleError(err));
  }

  private setStatus(status: Status) {
    this.status = this.processText(JSON.stringify(status, null, 4));
    this.statusDate = this.timestamp();
  }

  loadLogs(): void {
    this.client.getLogs().subscribe(log => {
      this.log = this.processText(log);
      this.logUpdate();
    }, err => this.handleError(err));
  }

  private logUpdate(): void {
    try {
      this.logDate = this.timestamp();
      this.logContainer.nativeElement.scrollTop = this.logContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error(err);
    }
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
    this.error = this.timestamp() + ' ' + this.error;
  }

  private timestamp() {
    return new Date().toLocaleString();
  }
}
