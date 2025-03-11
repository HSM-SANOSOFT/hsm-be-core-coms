import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';

import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [MailerModule, DatabaseModule],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
