import { Injectable } from '@nestjs/common';
import * as Docker from 'dockerode';
import { Container } from 'dockerode';
import { Status } from './_models/Status';
import { AppException } from './AppException';
import { Observable, Subscriber } from 'rxjs';
import { IncomingMessage } from 'http';
import * as AnsiConverter from 'ansi-to-html';

@Injectable()
export class AppService {
  private docker: Docker;
  private container: Container;
  private logsSubscriber: Subscriber<string>[] = [];
  private statusSubscriber: Subscriber<Status>[] = [];
  private logStream: IncomingMessage;
  private eventStream: IncomingMessage;
  private readonly containerName = 'valheim';
  private readonly ansiConverter = new AnsiConverter();

  constructor() {
    this.docker = new Docker({ socketPath: '/var/run/docker.sock' });
    this.container = this.docker.getContainer(this.containerName);
  }

  getStatus(): Promise<Status> {
    this.followContainer();
    return this.container.inspect().then(value => {
      const state = value.State;
      return {
        status: state.Status,
        exitCode: state.ExitCode,
        error: state.Error,
        startedAt: state.StartedAt,
        finishedAt: state.FinishedAt,
        runningOrRestarting: state.Running || state.Restarting,
      };
    });
  }

  start(): Promise<void> {
    return this.getStatus().then(status => {
      if (!status.runningOrRestarting) {
        return this.container.start();
      }
      return Promise.reject(new AppException('Already running'));
    });
  }

  stop(): Promise<void> {
    return this.getStatus().then(status => {
      if (status.runningOrRestarting) {
        return this.container.stop();
      }
      return Promise.reject(new AppException('Not running'));
    });
  }

  getLogs(lines: number): Promise<string> {
    return this.container.logs({
      tail: lines,
      stdout: true,
      stderr: true,
    }).then(value => {
      this.followLogs();
      return this.parseLog(value as any as Buffer);
    });
  }

  private parseLog(buffer: Buffer): string {
    let log = '';
    let offset = 0;
    while (offset < buffer.length) {
      if (buffer.readInt8(offset) == 2) {
        log = log + '<span style="color:#F00">[ERROR] </span>';
      }
      const length = buffer.readUInt32BE(offset + 4);
      offset += 8;
      const end = offset + length;
      log = log + this.processText(buffer.toString('utf-8', offset, end));
      offset = end;
    }
    return log;
  }

  private processText(text: string): string {
    return this.ansiConverter.toHtml(text.replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/'/g, '&apos;')
      .replace(/\n/g, '<br>'));
  }

  subscribeLogs(): Observable<string> {
    return new Observable(subscriber => {
      this.followLogs();
      this.logsSubscriber.push(subscriber);
      subscriber.add(() => {
        const index = this.logsSubscriber.indexOf(subscriber);
        if (index !== -1) {
          this.logsSubscriber.splice(index, 1);
        }
      });
    });
  }

  subscribeStatus(): Observable<Status> {
    return new Observable(subscriber => {
      this.followContainer();
      this.statusSubscriber.push(subscriber);
      subscriber.add(() => {
        const index = this.statusSubscriber.indexOf(subscriber);
        if (index !== -1) {
          this.statusSubscriber.splice(index, 1);
        }
      });
    });
  }

  private followContainer() {
    if (!this.eventStream) {
      console.log('follow container events');
      this.docker.getEvents({ filters: { container: [this.containerName] } }).then((stream: IncomingMessage) => {
        this.eventStream = stream;
        stream.on('data', data => {
          console.log('received event');
          this.getStatus().then(status => {
            if (status.runningOrRestarting) {
              this.followLogs();
            }
            for (const subscriber of this.statusSubscriber) {
              subscriber.next(status);
            }
          });
        });
        stream.on('error', err => console.error(err));
        stream.on('close', () => this.eventStreamEnded());
        stream.on('end', () => this.eventStreamEnded());
      });
    }
  }

  private eventStreamEnded(): void {
    console.log('event stream closed');
    this.eventStream = null;
  }

  private followLogs() {
    if (!this.logStream) {
      console.log('follow logs');
      this.container.logs({
        follow: true,
        tail: 0,
        stdout: true,
        stderr: true,
      }).then((stream: IncomingMessage) => {
        this.logStream = stream;
        stream.on('data', data => {
          const log = this.parseLog(data);
          for (const subscriber of this.logsSubscriber) {
            subscriber.next(log);
          }
        });
        stream.on('error', err => console.error(err));
        stream.on('close', () => this.logStreamEnded());
        stream.on('end', () => this.logStreamEnded());
      });
    }
  }

  private logStreamEnded(): void {
    console.log('log stream closed');
    this.logStream = null;
  }
}
