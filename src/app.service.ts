import { Injectable } from '@nestjs/common';
import * as Docker from 'dockerode';
import { Container } from 'dockerode';
import { Status } from './_models/Status';

@Injectable()
export class AppService {
  private docker: Docker;

  constructor() {
    this.docker = new Docker({ socketPath: '/var/run/docker.sock' });
  }

  getStatus(): Promise<Status> {
    return this.container.inspect().then(value => {
      const state = value.State;
      return {
        status: state.Status,
        exitCode: state.ExitCode,
        error: state.Error,
        startedAt: state.StartedAt
      };
    });
  }

  private get container(): Container {
    return this.docker.getContainer('web-starter');
  }
}
