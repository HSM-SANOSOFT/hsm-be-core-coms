import { BadRequestException, Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

import { SendSMSDto } from './../dto/sendSMSDto';
import { SmsService } from './sms.service';

@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @MessagePattern('sendSMS')
  async sendSMS(@Payload() sendSMSDto: SendSMSDto) {
    try {
      const sms = await this.smsService.sendSms(sendSMSDto);
      return sms;
    } catch (e) {
      throw new RpcException(e);
    }
  }
}
