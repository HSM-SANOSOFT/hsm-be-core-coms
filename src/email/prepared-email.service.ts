import Mailchimp from '@mailchimp/mailchimp_transactional';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { DatabaseRepository } from '../database/database.repository';
import { validatePreparedEmail } from './dto/prepared-email';
import { MailerService } from './mailer/mailer.service';

@Injectable()
export class PreparedEmailService {
  constructor(
    @Inject('MAILER') private readonly emailer: Mailchimp.ApiClient,
    private readonly mailer: MailerService,
    private readonly database: DatabaseRepository,
  ) {}

  async send(input: unknown, files: Express.Multer.File[]): Promise<Mailchimp.MessagesSendResponse[]> {
    let data: ReturnType<typeof validatePreparedEmail>;
    try { data = validatePreparedEmail(input); }
    catch { throw new RpcException({ statusCode: HttpStatus.BAD_REQUEST, message: 'Invalid prepared email' }); }
    const attachments = this.mailer.templateAttachmentsParcer(files);
    const message: Mailchimp.MessagesMessage = {
      from_name: 'Hospital Santamaria',
      from_email: 'noreply@hospitalsm.org',
      to: [{ email: data.email, type: 'to' }],
      subject: data.subject, html: data.html, text: data.text,
      merge: false, auto_text: false, track_opens: false, track_clicks: false,
      ...(attachments.length > 0 && { attachments }),
    };
    try {
      const response = await this.emailer.messages.send({ message });
      if (!Array.isArray(response) || response.length !== 1 || !response[0]?._id) throw new Error('No provider receipt');
      await this.database.mailRecordsRepository.emailRecord(response[0], message, `PORTAL_EMAIL:${data.model}`, '0', 'none');
      return response;
    } catch {
      // Acceptance can precede a database/network failure. Never retry here or log content.
      throw new RpcException({ statusCode: HttpStatus.SERVICE_UNAVAILABLE, message: 'Prepared email outcome requires verification before retrying' });
    }
  }
}
