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
    this.client.getStatus().subscribe(status => this.status = JSON.stringify(status), this.handleError);
  }

  loadLogs(): void {
    this.client.getLogs().subscribe(log => {
      console.log(log)
      this.log = log;
    }, this.handleError);
  }

  start(): void {
    this.loading = true;
    this.client.start().subscribe(() => {
      this.loading = false;
    }, this.handleError);
  }

  stop(): void {
    this.loading = true;
    this.client.stop().subscribe(() => {
      this.loading = false;
    }, this.handleError);
  }

  private handleError(error: string) {
    console.error(error);
    this.error = error;
    this.loading = false;
  }
}
