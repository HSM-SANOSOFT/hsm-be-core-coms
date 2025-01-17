import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { MailerService } from '@nestjs-modules/mailer';

import { DatabaseService } from './database/database.service';
import { SendEmailDto } from './dto/sendEmailDto';

@Injectable()
export class AppService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly mailerService: MailerService,
  ) {}

  private readonly logger = new Logger('COMS');

  InitMS() {
    return 'Microservice is up and running!';
  }

  async sendTemplateEmail(sendEmailDto: SendEmailDto): Promise<boolean> {
    const { to } = sendEmailDto;
    try {
      await this.mailerService.sendMail(sendEmailDto);
      this.logger.log(`Correo enviado exitosamente a: ${to}`);
      return true;
    } catch (error) {
      this.logger.error(`Error al enviar el correo a ${to}: ${error.message}`);
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: { success: false, error: error.message },
      });
    }
  }
}
