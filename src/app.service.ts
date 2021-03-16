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
    this.container = this.docker.getContainer('valheim');
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
    let log = '';
    let offset = 0;
    while (offset < buffer.length) {
      if (buffer.readInt8(offset) == 2) {
        log = log + 'ERROR: ';
      }
      const length = buffer.readUInt32BE(offset + 4);
      const headerOffset = offset + 8;
      const end = headerOffset + length;
      log = log + buffer.toString('utf-8', headerOffset, end);
      offset = end;
    }
    return log.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
  }
}
