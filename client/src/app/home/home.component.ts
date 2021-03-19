import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ClientService } from '../client.service';
import { WebsocketService } from '../websocket.service';
import { Status } from '../_models/Status';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('logContainer') private logContainer: ElementRef;
  status: Status;
  statusDate: string;
  log: string;
  logDate: string;
  loading: boolean;
  autoScroll = true;
  dateFormat = 'dd.MM.yyyy HH:mm:ss.SSS';
  lines = 100;

  constructor(private client: ClientService, private socket: WebsocketService, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.loadStatus();
    this.socket.onStatus().subscribe(status => this.setStatus(status));
    this.loadLogs();
    this.socket.onLog().subscribe(log => {
      this.log = this.log + log;
      this.logUpdate();
    });
  }


  loadStatus(): void {
    this.client.getStatus().subscribe(status => this.setStatus(status),
      err => this.handleError(err));
  }

  private setStatus(status: Status) {
    this.status = status;
    this.statusDate = this.timestamp();
  }

  loadLogs(): void {
    if (this.lines) {
      this.client.getLogs(this.lines).subscribe(log => {
        this.log = log;
        this.logUpdate();
      }, err => this.handleError(err));
    } else {
      this.errorSnackBar('Invalid lines number');
    }
  }

  private logUpdate(): void {
    this.logDate = this.timestamp();
    if (this.autoScroll) {
      setTimeout(() => this.scrollLogToBottom(), 0);
    }
  }

  private scrollLogToBottom() {
    try {
      this.logContainer.nativeElement.scrollTop = this.logContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error(err);
    }
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
    let message;
    if (error.error && error.error.message) {
      message = error.error.message;
    } else if (error.message) {
      message = error.message;
    } else {
      message = error;
    }
    console.error(message);
    this.errorSnackBar(message);
  }

  private errorSnackBar(message) {
    this.snackBar.open(message, null, { duration: 5000, panelClass: ['mat-toolbar', 'mat-warn'] });
  }

  private timestamp() {
    return new Date().toLocaleString();
  }
}
