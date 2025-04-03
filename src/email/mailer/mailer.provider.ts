import * as Mailchimp from '@mailchimp/mailchimp_transactional';
import { Logger } from '@nestjs/common';
import { envs } from 'src/config';

export const MailerProvider = [
  {
    provide: 'MAILER',
    useFactory: () => {
      const logger = new Logger('MailerProvider');
      const apiKey: string = envs.MAIL_API_KEY;
      try {
        if (!apiKey) {
          throw new Error('Mail API key not found');
        }
        return Mailchimp(apiKey);
      } catch (error) {
        logger.error(JSON.stringify(error));
      }
    },
  },
];
