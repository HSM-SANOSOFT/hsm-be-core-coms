import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';

import { MailerProvider } from '../mailer/mailer.provider';
import { MailerService } from '../mailer/mailer.service';

@Module({
  imports: [DatabaseModule],
  providers: [...MailerProvider, MailerService],
  exports: [...MailerProvider, MailerService],
})
export class MailerModule {}
