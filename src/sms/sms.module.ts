import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';

import { MasivaModule } from './masiva/masiva.module';
import { SmsController } from './sms.controller';
import { SmsService } from './sms.service';

@Module({
  controllers: [SmsController],
  providers: [SmsService],
  imports: [HttpModule, DatabaseModule, MasivaModule],
  exports: [SmsService],
})
export class SmsModule {}
