import Mailchimp from '@mailchimp/mailchimp_transactional';
import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { DatabaseService } from '../database/database.service';
import { TemplateDto } from './dto/templateDto';
import { MailerService } from './mailer/mailer.service';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  constructor(
    @Inject('MAILER') private readonly emailer: Mailchimp.ApiClient,
    private readonly mailer: MailerService,
    private readonly database: DatabaseService,
  ) {}
  async sendEmail(
    email: string,
    template: TemplateDto,
    files: Express.Multer.File[],
  ): Promise<unknown> {
    const templateName = template.name;
    const templateVersion = template.version;
    const templateBaseVersion = template.baseVersion;
    const templateData = template.data;

    const html = this.mailer.templateHtmlParcer(
      templateName,
      templateVersion,
      templateBaseVersion,
    );
    const subject = this.mailer.templateSubjectParcer(templateName);
    const data2Parce = {
      ...templateData,
      titulo: subject,
    };
    const data = this.mailer.templateDataParcer(data2Parce);
    const attachments: Mailchimp.MessageAttachment[] =
      this.mailer.templateAttachmentsParcer(files);

    const message: Mailchimp.MessagesMessage = {
      from_name: 'Hospital Santamaria',
      from_email: 'soporte@hospitalsantamaria.com.ec',
      bcc_address: 'sistemas@hospitalsantamaria.com.ec',
      subject: subject,
      to: [{ email: email, type: 'to' }],
      html: html,
      global_merge_vars: data,
      auto_text: true,
      track_opens: true,
      track_clicks: true,
      merge_language: 'handlebars',
      ...(attachments.length > 0 && { attachments: attachments }),
    };
    try {
      const response = await this.emailer.messages.send({ message: message });
      if (!Array.isArray(response) || !response[0] || !response[0]._id) {
        this.logger.error(response);
        throw new RpcException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: response,
        });
      }
      await this.database.emailRecord(
        response[0],
        message,
        templateName,
        templateVersion,
        templateBaseVersion,
      );
      return response;
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error as string,
      });
    }
  }

  async resendEmail(Idcorreo: string): Promise<unknown> {
    try {
      const message = await this.database.resendEmail(Idcorreo);
      if (!message) {
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Email record not found',
        });
      }
      const response = await this.emailer.messages.send({ message: message });
      if (!Array.isArray(response) || !response[0] || !response[0]._id) {
        this.logger.error(response);
        throw new RpcException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: response,
        });
      }
      await this.database.emailRecordUpdate(Idcorreo, response[0]);
      return response;
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error as string,
      });
    }
  }
}
