import { Injectable } from '@nestjs/common';
import * as Docker from 'dockerode';
import { Container } from 'dockerode';
import { Status } from './_models/Status';
import { AppException } from './AppException';

@Injectable()
export class AppService {
  private docker: Docker;
  private container: Container;

  constructor() {
    this.docker = new Docker({ socketPath: '/var/run/docker.sock' });
    this.container = this.docker.getContainer('web-starter');
  }

  getStatus(): Promise<Status> {
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

  getLogs(): Promise<string> {
    return this.container.logs({ timestamps: true, tail: 200, stdout: true, stderr: true }).then(this.streamToString);
  }

  private streamToString(stream: NodeJS.ReadableStream): Promise<string> {
    const chunks = [];
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on('error', (err) => reject(err));
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
  }
}
