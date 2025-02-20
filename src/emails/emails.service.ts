import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { MailerService } from '@nestjs-modules/mailer';
import { DatabaseService } from 'src/database/database.service';

import { SendEmailDto } from './dto/sendEmailDto';

@Injectable()
export class EmailsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly mailerService: MailerService,
  ) {}
  async sendEmail(body: SendEmailDto) {}
}
