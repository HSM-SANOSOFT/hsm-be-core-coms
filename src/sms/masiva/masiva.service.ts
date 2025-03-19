import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import * as moment from 'moment';
import { lastValueFrom } from 'rxjs';
import { envs } from 'src/config';
import { DatabaseService } from 'src/database/database.service';
@Injectable()
export class MasivaService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly httpService: HttpService,
  ) {}

  async updateToken() {
    const tokendata = await this.databaseService.getSmsToken();
    let token: string = tokendata.TOKEN;
    const caducidad = moment(
      tokendata.CADUCIDAD,
      'DD/MM/YYYY HH:mm:ss',
    ).toDate();
    if (caducidad.getTime() < Date.now()) {
      const body: object = {
        client_id: envs.MASIVA_CLIENT_ID,
        client_secret: envs.MASIVA_CLIENT_SECRET,
        grant_type: 'client_credentials',
      };
      try {
        const response = await lastValueFrom(
          this.httpService.post(`${envs.MASIVA_URL}/token`, body),
        );
        const status = response.status;
        const data = response.data as {
          access_token: string;
          expires_in: number;
          token_type: string;
          scope: string;
        };
        token = data.access_token;
        await this.databaseService.updateSmsToken(token);
        await this.databaseService.updateSmsApiLog(
          'ok',
          'CREDENCIALES',
          'GENERAR NUEVO TOKEN',
          status,
          data,
        );
        return token;
      } catch (error) {
        throw new RpcException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error as string,
        });
      }
    }
    return token;
  }

  templateParcer(templateData: object, templateName: string) {
    const subjectMap: { [key: string]: string } = {
      'HSM-CORE-AUTH-PIN':
        'HOSPITAL SANTAMARIA: LE INFORMA QUE EL CODIGO SOLICITADO DE {var1} ES {var2}.',
      'HSM-CORE-COMS-RECORDATORIO-CITA':
        'HOSPITAL SANTAMARIA: LE RECUERDA DE SU CITA EL DIA {var1} CON {var2} A LAS {var3}.',
    };
    const unParsedTemplate = subjectMap[templateName];
    if (!unParsedTemplate) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: 'Template not found',
      });
    }
    const formattedTemplate = Object.keys(templateData).reduce(
      (acc, key) =>
        acc.replace(new RegExp(`{${key}}`, 'g'), String(templateData[key])),
      unParsedTemplate,
    );
    return formattedTemplate;
  }
}
