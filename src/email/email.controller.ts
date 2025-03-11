import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { TemplateDto } from './dto/templateDto';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @MessagePattern('sendEmail')
  async sendEmail(
    @Payload()
    payload: {
      data: { email: string; template: TemplateDto };
      files: Express.Multer.File[];
    },
  ) {
    const data: { email: string; template: TemplateDto } = payload.data;
    const email = data.email;
    const template = data.template;
    const files: Express.Multer.File[] = payload.files;
    return await this.emailService.sendEmail(email, template, files);
  }

  @MessagePattern('resendEmail')
  async resendEmail(@Payload() id: string) {
    return await this.emailService.resendEmail(id);
  }
}
