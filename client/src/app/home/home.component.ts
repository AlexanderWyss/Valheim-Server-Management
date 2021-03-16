import { Component, OnInit } from '@angular/core';
import { ClientService } from '../client.service';

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

  constructor(private client: ClientService) {
  }

  ngOnInit(): void {
    this.loadStatus();
    this.loadLogs();
  }

  loadStatus(): void {
    this.client.getStatus().subscribe(status => this.status = JSON.stringify(status, null, 4), err => this.handleError(err));
  }

  loadLogs(): void {
    this.client.getLogs().subscribe(log => this.log = log, err => this.handleError(err));
  }

  start(): void {
    this.loading = true;
    this.client.start().subscribe(() => {
      this.loading = false;
    }, err => {
      this.handleError(err);
      this.loading = false;
    });
  }

  stop(): void {
    this.loading = true;
    this.client.stop().subscribe(() => {
      this.loading = false;
    }, err => {
      this.handleError(err);
      this.loading = false;
    });
  }

  private handleError(error: any) {
    console.error(error);
    if (error.error && error.error.message) {
      this.error = error.error.message;
    } else {
      this.error = error;
    }
  }
}
