import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService 
  ) {
  }

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('send-email')
  async testSendEmail() {
    return await this.appService.sendEmail('kikow19009@94jo.com')
  }
}
