import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';

import { MasivaService } from './masiva.service';

@Module({
  imports: [HttpModule, DatabaseModule],
  providers: [MasivaService],
  exports: [MasivaService],
})
export class MasivaModule {}
