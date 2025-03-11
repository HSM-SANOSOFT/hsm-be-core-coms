import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { envs } from 'config';
import { lastValueFrom, Observable } from 'rxjs';
import { DatabaseService } from 'src/database/database.service';
import { SendSMSDto } from 'src/dto/sendSMSDto';
import { plantillasSMS } from 'src/templates/sms/plantillas.sms';
import { Helpers } from 'src/utils/helpers';

@Injectable()
export class SmsService {
  private readonly template: any;
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly helpers: Helpers,
    private readonly httpService: HttpService,
  ) {}
  async sendSms(smsbody: SendSMSDto) {
    /*
    const { telefono, texto, plantilla, modulo, cedula } = smsbody;
    console.log(smsbody);
    try {
      const token = await this.helpers.updateToken();
      if (token !== 'error') {
        const replaceTemplate = (texto: object, plantilla: string) => {
          return plantilla.replace(/{(\w+)}/g, (match, key) => {
            return texto[key] !== undefined ? texto[key] : match;
          });
        };
        if (!plantillasSMS[plantilla]) {
          return 'Plantilla no encontrada';
        }
        const smstext = replaceTemplate(texto, plantillasSMS[plantilla]);
        console.log(smstext);
        const response = await lastValueFrom(
          this.httpService.post(
            `${envs.MASIVA_URL}messages/send`,
            { to_number: telefono, content: smstext },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            },
          ),
        );
        console.log(response);
        if (response.status === 200) {
          await this.databaseService.query({
            label: `SMS ENVIADO`,
            sql: `INSERT INTO PDP_SMS_ENVIADOS (TEXTO, CEDULA, TELEFONO, MODULO) VALUES (:texto, :cedula, :telefono, :modulo)`,
            params: [smstext, cedula, telefono, modulo],
          });
          await this.databaseService.query({
            label: `SMS ENVIADO`,
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
                'MASIVA SMS')`,
            params: [
              '10.1.1.4',
              'SMS ENVIADO',
              cedula,
              'COMSUMO DE API',
              response.status,
              JSON.stringify(response.data),
            ],
          });
        }
        return 'Mensaje enviado';
      }
    } catch (error) {
      return error;
    }
    */
  }
}
