import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { DatabaseModule } from './../database/database.module'; // ✅ Import the module, not the service
import { Helpers } from './helpers';

@Module({
  imports: [HttpModule, DatabaseModule], // ✅ Import the module that provides DatabaseService
  providers: [Helpers],
  exports: [Helpers],
})
export class UtilsModule {}
