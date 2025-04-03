import { Injectable, Logger } from '@nestjs/common';

import { DatabaseService } from '../database.service';
import { ApiTokensLogModel } from '../models';

@Injectable()
export class ApiTokensLogRepository {
  private readonly logger = new Logger();
  constructor(private readonly databaseService: DatabaseService) {}

  async updateSmsApiLog(
    RESPUESTA: string,
    SOLICITUD: string,
    ACCION: string,
    COD_RESP: number,
    data:
      | {
          access_token: string;
          expires_in: number;
          token_type: string;
          scope: string;
        }
      | {
          error: string;
          status: number;
          message: string;
        },
  ) {
    const DATA_RC = JSON.stringify(data);
    await this.databaseService.execute<ApiTokensLogModel>(
      `INSERT INTO API_TOKENS_LOG (
                IP,
                FECHA,
                RESPUESTA,
                SOLICITUD,
                ACCION,
                COD_RESP,
                DATA_RC,
                API
            ) VALUES (
                :IP,
                SYSDATE,
                :RESPUESTA,
                :SOLICITUD,
                :ACCION,
                :COD_RESP,
                :DATA_RC,
                'MASIVA SMS'
            )`,
      ['10.1.1.4', RESPUESTA, SOLICITUD, ACCION, COD_RESP, DATA_RC],
    );
  }
}
