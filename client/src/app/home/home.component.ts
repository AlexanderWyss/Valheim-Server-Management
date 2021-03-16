import { Component, OnInit } from '@angular/core';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  status: string;
  log: string;
  error: string;

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
    this.client.getLogs().subscribe(log => this.log = log, this.handleError);
  }

  start(): void {
    this.client.start().subscribe(() => {
      return;
    }, this.handleError);
  }

  stop(): void {
    this.client.stop().subscribe(() => {
      return;
    }, this.handleError);
  }

  private handleError(error: string) {
    this.error = error;
  }
}
