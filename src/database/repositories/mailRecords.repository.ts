import Mailchimp from '@mailchimp/mailchimp_transactional';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import * as oracledb from 'oracledb';

import { DatabaseService } from '../database.service';
import { MailRecordsModel } from '../models';

@Injectable()
export class MailRecordsRepository {
  private readonly logger = new Logger();
  constructor(private readonly databaseService: DatabaseService) {}

  async emailRecord(
    response: Mailchimp.MessagesSendResponse,
    message: Mailchimp.MessagesMessage,
    templateName: string,
    templateVersion: string,
    templateBaseVersion: string,
  ) {
    const Idcorreo = response._id;
    const email = response.email;
    const status = response.status;
    const fechaCreacion = new Date();
    const fechaEnvio = new Date();

    const results = await this.databaseService.execute<MailRecordsModel>(
      `INSERT INTO MAIL_RECORDS (IDCORREO, EMAIL, STATUS, TEMPLATENAME, TEMPLATEVERSION, BASEVERSION, MESSAGE ,FECHACREACION, FECHAULTIMOENVIO) VALUES (:idcorreo, :email, :status, :templatename, :templateversion, :baseversion, :message, :fechacreacion, :fechaultimoenvio)`,
      [
        Idcorreo,
        email,
        status,
        templateName,
        templateVersion,
        templateBaseVersion,
        JSON.stringify(message),
        fechaCreacion,
        fechaEnvio,
      ],
      { autoCommit: true },
    );
    return results;
  }

  async resendEmail(id: string) {
    const results = await this.databaseService.execute<MailRecordsModel>(
      `SELECT MESSAGE FROM MAIL_RECORDS WHERE IDCORREO = :idcorreo`,
      [id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );
    if (results.rows && results.rows.length > 0) {
      const data = results.rows[0].MESSAGE as string;
      const message = JSON.parse(data) as Mailchimp.MessagesMessage;
      return message;
    } else {
      this.logger.debug('No rows found');
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'No rows found',
      });
    }
  }

  async emailRecordUpdate(
    Idcorreo: string,
    response: Mailchimp.MessagesSendResponse,
  ) {
    const status = response.status;
    const fechaultimoenvio = new Date();
    const results = await this.databaseService.execute<MailRecordsModel>(
      `UPDATE MAIL_RECORDS SET STATUS = :status, FECHAULTIMOENVIO = :fechaultimoenvio WHERE IDCORREO = :idcorreo`,
      [status, fechaultimoenvio, Idcorreo],
      { autoCommit: true },
    );
    return results;
  }
}
