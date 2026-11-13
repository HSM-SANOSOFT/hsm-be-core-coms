import Mailchimp from '@mailchimp/mailchimp_transactional';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { DatabaseRepository } from '../database/database.repository';
import { validatePreparedEmail } from './dto/prepared-email';
import { MailerService } from './mailer/mailer.service';

/** Sender display name depends only on tipo_correo ("R"/"r" = Sanosoft); the address stays fixed. */
export function resolveFromName(tipoCorreo?: string | null): string {
  return tipoCorreo?.trim().toUpperCase() === 'R' ? 'Sanosoft' : 'Hospital Santamaria';
}

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
      // Resolved name travels inside the MAIL_RECORDS message, so resends keep it.
      from_name: resolveFromName(data.tipo_correo),
      from_email: 'noreply@hospitalsm.org',
      to: [{ email: data.email, type: 'to' }, ...(data.bcc ?? []).map(email => ({ email, type: 'bcc' as const }))],
      preserve_recipients: false,
      subject: data.subject, html: data.html, text: data.text,
      merge: false, auto_text: false, track_opens: false, track_clicks: false,
      ...(attachments.length > 0 && { attachments }),
    };
    try {
      const response = await this.emailer.messages.send({ message });
      if (!Array.isArray(response)) throw new Error('No provider receipts');
      const expected = new Set(message.to!.map(recipient => recipient.email.toLowerCase()));
      let incomplete = response.length !== expected.size;
      // Persist a single-recipient resend payload per receipt, never the whole group.
      for (const receipt of response) {
        if (!receipt?._id || typeof receipt.email !== 'string' || !expected.delete(receipt.email.toLowerCase())) { incomplete = true; continue; }
        const single = { ...message, to: message.to!.filter(recipient => recipient.email.toLowerCase() === receipt.email.toLowerCase()) };
        try { await this.database.mailRecordsRepository.emailRecord(receipt, single, `PORTAL_EMAIL:${data.model}`, '0', 'none'); }
        catch { incomplete = true; }
      }
      if (incomplete || expected.size > 0) throw new Error('Incomplete provider receipts or audit');
      return response;
    } catch {
      // Acceptance can precede a database/network failure. Never retry here or log content.
      throw new RpcException({ statusCode: HttpStatus.SERVICE_UNAVAILABLE, message: 'Prepared email outcome requires verification before retrying' });
    }
  }
}
