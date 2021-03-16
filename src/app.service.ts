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
    return this.container.logs({
      tail: 200,
      stdout: true,
      stderr: true,
    }).then(value => this.parseLog(value as any as Buffer));
  }

  private parseLog(buffer: Buffer): string {
    console.log(buffer)
    return null;
  }
}
