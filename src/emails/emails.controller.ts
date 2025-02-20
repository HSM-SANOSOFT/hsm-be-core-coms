import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { SendEmailDto } from './dto/sendEmailDto';
import { EmailsService } from './emails.service';

@Controller()
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @MessagePattern('sendEmail')
  create(@Payload() createEmailDto: SendEmailDto) {
    return this.emailsService.sendEmail(createEmailDto);
  }
}
