import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { envs } from 'config';
import { lastValueFrom, Observable } from 'rxjs';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class Helpers {
  constructor(
    private readonly HttpService: HttpService,
    private readonly databaseService: DatabaseService,
  ) {}
  async updateToken() {
    let token;
    try {
      const sql = {
        label: 'updateToken',
        sql: `SELECT TOKEN, CADUCIDAD FROM API_TOKENS WHERE DOMINIO='MASIVA'`,
        params: [],
      };
      const tokeninfo = await this.databaseService.query(sql);
      if (new Date(tokeninfo.rows[0].CADUCIDAD).getTime() > Date.now()) {
        return tokeninfo.rows[0].TOKEN;
      } else {
        const body: object = {
          client_id: envs.MASIVA_CLIENT_ID,
          client_secret: envs.MASIVA_CLIENT_SECRET,
          grant_type: 'client_credentials',
        };
        const response = await lastValueFrom(
          this.HttpService.post(`${envs.MASIVA_URL}token`, body),
        );
        if (response.status === 200) {
          const data = response.data;
          token = data.access_token;
          await this.databaseService.query({
            label: 'UPDATE TOKEN',
            sql: `INSERT INTO API_TOKENS_LOG (
                        "IP",
                        "FECHA",
                        "RESPUESTA",
                        "SOLICITUD",
                        "ACCION",
                        "COD_RESP",
                        "DATA_RC",
                        "API"
                    ) VALUES (
                        :IP,
                        SYSDATE,
                        :RESPUESTA,
                        :SOLICITUD,
                        :ACCION,
                        :COD_RESP,
                        :DATA_RC,
                        'MASIVA SMS'
                    );`,
            params: [
              '10.1.1.4',
              'CREDENCIALES',
              'GENERAR NUEVO TOKEN',
              response.status,
              JSON.stringify(data),
            ],
          });
          await this.databaseService.query({
            label: 'UPDATE TOKEN',
            sql: `UPDATE API_TOKENS SET TOKEN = :TOKEN, CADUCIDAD = SYSDATE + (1/24)
                WHERE DOMINIO = 'MASIVA'`,
            params: [token],
          });
          return token;
        }
      }
    } catch (error) {
      console.log(error);
      return (token = 'error');
    }
  }
}
