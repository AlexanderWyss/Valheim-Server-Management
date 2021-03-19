import { Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Status } from './_models/Status';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get('status')
  getStatus(): Promise<Status> {
    return this.appService.getStatus();
  }

  @Post('start')
  start(): Promise<void> {
    return this.appService.start();
  }

  @Post('stop')
  stop(): Promise<void> {
    return this.appService.stop();
  }

  @Get('logs/:lines?')
  getLogs(@Param('lines') lines?: number): Promise<string> {
    return this.appService.getLogs(lines ? lines : 200);
  }
}
