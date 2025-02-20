import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';

import { envs } from '../config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { EmailsModule } from './emails/emails.module';
import { SmsModule } from './sms/sms.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: envs.MAIL_HOST,
        port: parseInt(envs.MAIL_PORT, 10),
        secure: true,
        auth: {
          user: envs.MAIL_USER,
          pass: envs.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: `"No Reply" <${envs.MAIL_FROM}>`,
      },
      template: {
        dir: path.join(__dirname, './templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    DatabaseModule,
    SmsModule,
    UtilsModule,
    EmailsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
