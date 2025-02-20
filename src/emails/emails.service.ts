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
  async sendEmail(body: SendEmailDto) {
    const { to, template } = body;
    try {
      const template_elegida = await this.databaseService.query({
        label: 'GET EMAIL TEMPLATE',
        sql: `SELECT * FROM PDP_EMAIL_PLANTILLA WHERE ID = :id`,
        params: [template],
      });
    } catch (error) {
      throw new RpcException(error);
    }
  }
  async create_email_template(body: any) {
    const { nombre, version, app } = body;
    try {
      await this.databaseService.query({
        label: 'CREATE EMAIL TEMPLATE',
        sql: `INSERT INTO PDP_EMAIL_PLANTILLA (NOMBRE, VERSION, APP) VALUES (:nombre, :version, :app)`,
        params: [nombre, version, app],
      });
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
