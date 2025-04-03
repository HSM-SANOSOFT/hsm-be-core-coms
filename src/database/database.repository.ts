import { Injectable } from '@nestjs/common';

import {
  ApiTokensLogRepository,
  ApiTokensRepository,
  MailRecordsRepository,
  PdpSmsEnviadosRepository,
} from './repositories';

@Injectable()
export class DatabaseRepository {
  constructor(
    public apiTokensRepository: ApiTokensRepository,
    public apiTokensLogRepository: ApiTokensLogRepository,
    public mailRecordsRepository: MailRecordsRepository,
    public pdpSmsEnviadosRepository: PdpSmsEnviadosRepository,
  ) {}
}
