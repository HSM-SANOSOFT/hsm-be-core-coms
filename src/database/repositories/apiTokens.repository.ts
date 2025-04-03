import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import * as oracledb from 'oracledb';

import { DatabaseService } from '../database.service';
import { ApiTokensModel } from '../models';

@Injectable()
export class ApiTokensRepository {
  private readonly logger = new Logger();
  constructor(private readonly databaseService: DatabaseService) {}

  async getSmsToken() {
    const results = await this.databaseService.execute<{
      TOKEN: string;
      CADUCIDAD: string;
    }>(
      `SELECT TOKEN, TO_CHAR(CADUCIDAD, 'DD/MM/YYYY HH24:MI:SS') AS CADUCIDAD FROM API_TOKENS WHERE DOMINIO='MASIVA'`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    if (results.rows && results.rows?.length > 0) {
      const tokenData = results.rows?.[0];
      return tokenData;
    } else {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'No rows found',
      });
    }
  }

  async updateSmsToken(token: string) {
    await this.databaseService.execute<ApiTokensModel>(
      `UPDATE API_TOKENS SET TOKEN = :TOKEN, CADUCIDAD = SYSDATE + (1/24)
                WHERE DOMINIO = 'MASIVA'`,
      [token],
      { autoCommit: true },
    );
  }
}
