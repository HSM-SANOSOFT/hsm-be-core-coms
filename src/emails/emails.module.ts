import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';

import { EmailsController } from './emails.controller';
import { EmailsService } from './emails.service';

@Module({
  controllers: [EmailsController],
  providers: [EmailsService],
  imports: [DatabaseModule], // ✅ Correct imports
})
export class EmailsModule {}
