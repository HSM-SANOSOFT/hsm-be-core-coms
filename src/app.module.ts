import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { EmailModule } from './email/email.module';
import { SmsModule } from './sms/sms.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [DatabaseModule, SmsModule, UtilsModule, EmailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
