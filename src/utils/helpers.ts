import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { envs } from 'config';
import * as moment from 'moment';
import { lastValueFrom } from 'rxjs';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class Helpers {
  constructor(
    private readonly HttpService: HttpService,
    private readonly databaseService: DatabaseService,
  ) {}
  async updateToken() {
    /*
    let token;
    try {
      const sql = {
        label: 'updateToken',
        sql: `SELECT TOKEN, TO_CHAR(CADUCIDAD, 'DD/MM/YYYY HH24:MI:SS') AS CADUCIDAD FROM API_TOKENS WHERE DOMINIO='MASIVA'`,
        params: [],
      };
      const tokeninfo = await this.databaseService.query(sql);
      const tokendata = tokeninfo.updateToken[0];
      const caducidad = moment(
        tokendata.CADUCIDAD,
        'DD/MM/YYYY HH:mm:ss',
      ).toDate();

      if (caducidad.getTime() > Date.now()) {
        return tokendata.TOKEN;
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
            params: [
              '10.1.1.4',
              'OK',
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
    */
  }
}
