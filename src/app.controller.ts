import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { AppService } from './app.service';
import { SendEmailDto } from './dto/sendEmailDto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  logger = new Logger('COMS');

  @MessagePattern('init')
  InitMS() {
    return this.appService.InitMS();
  }

  @MessagePattern('sendTemplateEmail')
  sendTemplateEmail(sendEmailDto: SendEmailDto) {
    return this.appService.sendTemplateEmail(sendEmailDto);
  }
}
