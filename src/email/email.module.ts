import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';

import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { MailerModule } from './mailer/mailer.module';
import { PreparedEmailController } from './prepared-email.controller';
import { PreparedEmailService } from './prepared-email.service';

@Module({
  imports: [MailerModule, DatabaseModule],
  controllers: [EmailController, PreparedEmailController],
  providers: [EmailService, PreparedEmailService],
})
export class EmailModule {}
