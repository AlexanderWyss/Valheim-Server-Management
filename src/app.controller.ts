import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Status } from './_models/Status';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('status')
  getStatus(): Promise<Status> {
    return this.appService.getStatus();
  }
}
