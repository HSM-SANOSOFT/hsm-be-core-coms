import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { envs } from 'src/config';
import { DatabaseService } from 'src/database/database.service';

import { MasivaService } from './masiva/masiva.service';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly httpService: HttpService,
    private readonly masivaService: MasivaService,
  ) {}

  async sendSms(data: {
    telefono: string;
    templateData: object;
    templateName: string;
    modulo: string;
    cedula: string;
  }) {
    try {
      const token = await this.masivaService.updateToken();
      if (!token) {
        throw new RpcException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error al obtener token',
        });
      }
      const formattedTemplate = this.masivaService.templateParcer(
        data.templateData,
        data.templateName,
      );
      const response = await lastValueFrom(
        this.httpService.post(
          `${envs.MASIVA_URL}/messages/send`,
          { to_number: data.telefono, content: formattedTemplate },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      const status = response.status;
      const responseData = response.data as {
        error: string;
        status: number;
        message: string;
      };

      await this.databaseService.smsRecord(
        formattedTemplate,
        data.cedula,
        data.telefono,
        data.modulo,
      );

      await this.databaseService.updateSmsApiLog(
        'SMS ENVIADO',
        data.cedula,
        'COMSUMO DE API',
        status,
        responseData,
      );
      return {
        message: 'Mensaje enviado',
      };
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error as string,
      });
    }
  }
}
