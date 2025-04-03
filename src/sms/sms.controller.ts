import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { SmsService } from './sms.service';

@Controller('sms')
export class SmsController {
  private readonly logger = new Logger(SmsController.name);
  constructor(private readonly smsService: SmsService) {}

  @MessagePattern('sendSms')
  async sendSMS(
    @Payload()
    data: {
      telefono: string;
      templateData: object;
      templateName: string;
      modulo: string;
      cedula: string;
    },
  ) {
    const response = await this.smsService.sendSms(data);
    this.logger.log(JSON.stringify(response));
    return response;
  }
}
