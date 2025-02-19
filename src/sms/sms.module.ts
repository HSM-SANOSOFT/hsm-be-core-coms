import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { Helpers } from 'src/utils/helpers';

import { SmsController } from './sms.controller';
import { SmsService } from './sms.service';

@Module({
  controllers: [SmsController],
  providers: [SmsService, Helpers],
  imports: [HttpModule, DatabaseModule],
  exports: [SmsService],
})
export class SmsModule {}
