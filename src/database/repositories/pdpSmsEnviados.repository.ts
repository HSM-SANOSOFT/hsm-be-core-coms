import { Injectable, Logger } from '@nestjs/common';

import { DatabaseService } from '../database.service';
import { PdpSmsEnviadosModel } from '../models';

@Injectable()
export class PdpSmsEnviadosRepository {
  private readonly logger = new Logger();
  constructor(private readonly databaseService: DatabaseService) {}

  async smsRecord(
    smstext: string,
    cedula: string,
    telefono: string,
    modulo: string,
  ) {
    const results = await this.databaseService.execute<PdpSmsEnviadosModel>(
      `INSERT INTO PDP_SMS_ENVIADOS (TEXTO, CEDULA, TELEFONO, MODULO) VALUES (:TEXTO, :CEDULA, :TELEFONO, :MODULO)`,
      [smstext, cedula, telefono, modulo],
      { autoCommit: true },
    );
    return results;
  }
}
