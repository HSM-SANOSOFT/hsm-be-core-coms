import { ApiTokensRepository } from './apiTokens.repository';
import { ApiTokensLogRepository } from './apiTokensLog.repository';
import { MailRecordsRepository } from './mailRecords.repository';
import { PdpSmsEnviadosRepository } from './pdpSmsEnviados.repository';

export const DatabaseRepositories = [
  ApiTokensRepository,
  ApiTokensLogRepository,
  MailRecordsRepository,
  PdpSmsEnviadosRepository,
];

export * from './apiTokens.repository';
export * from './apiTokensLog.repository';
export * from './mailRecords.repository';
export * from './pdpSmsEnviados.repository';
