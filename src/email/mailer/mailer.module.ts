import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';

import { MailerProvider } from '../mailer/mailer.provider';
import { MailerService } from '../mailer/mailer.service';
import { MailerTemplateProvider } from '../mailer/mailer.template.provider';
@Module({
  imports: [DatabaseModule],
  providers: [...MailerProvider, MailerService, MailerTemplateProvider],
  exports: [...MailerProvider, MailerService],
})
export class MailerModule {}
