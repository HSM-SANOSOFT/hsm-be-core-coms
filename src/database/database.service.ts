import Mailchimp from '@mailchimp/mailchimp_transactional';
import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import * as oracledb from 'oracledb';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);
  constructor(
    @Inject('DATABASE_CONNECTION') private readonly dbPool: oracledb.Pool,
  ) {}

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

    let connection: oracledb.Connection | null = null;
    try {
      connection = await this.dbPool.getConnection();
      const results = await connection.execute(
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
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error as string,
      });
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (error) {
          this.logger.error(error);
        }
      }
    }
  }

  async resendEmail(id: string) {
    let connection: oracledb.Connection | null = null;
    try {
      connection = await this.dbPool.getConnection();
      const results = await connection.execute(
        `SELECT MESSAGE FROM MAIL_RECORDS WHERE IDCORREO = :idcorreo`,
        [id],
        { outFormat: oracledb.OUT_FORMAT_OBJECT },
      );

      if (results.rows && results.rows.length > 0) {
        const data = results.rows[0] as { MESSAGE: string };
        const message = JSON.parse(data.MESSAGE) as Mailchimp.MessagesMessage;
        return message;
      } else {
        this.logger.debug('No rows found');
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'No rows found',
        });
      }
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error as string,
      });
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (error) {
          this.logger.error(error);
        }
      }
    }
  }

  async emailRecordUpdate(
    Idcorreo: string,
    response: Mailchimp.MessagesSendResponse,
  ) {
    const status = response.status;
    let connection: oracledb.Connection | null = null;
    const fechaultimoenvio = new Date();
    try {
      connection = await this.dbPool.getConnection();
      const results = await connection.execute(
        `UPDATE MAIL_RECORDS SET STATUS = :status, FECHAULTIMOENVIO = :fechaultimoenvio WHERE IDCORREO = :idcorreo`,
        [status, fechaultimoenvio, Idcorreo],
        { autoCommit: true },
      );
      return results;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error as string,
      });
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (error) {
          this.logger.error(error);
        }
      }
    }
  }

  async smsRecord(
    smstext: string,
    cedula: string,
    telefono: string,
    modulo: string,
  ) {
    let connection: oracledb.Connection | null = null;
    try {
      connection = await this.dbPool.getConnection();
      await connection.execute(
        `INSERT INTO PDP_SMS_ENVIADOS
                (TEXTO, CEDULA, TELEFONO, MODULO)
                VALUES
                (:TEXTO, :CEDULA, :TELEFONO, :MODULO)`,
        [smstext, cedula, telefono, modulo],
      );
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error as string,
      });
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (error) {
          this.logger.error(error);
        }
      }
    }
  }

  async getSmsToken() {
    let connection: oracledb.Connection | null = null;
    try {
      connection = await this.dbPool.getConnection();
      const tokeninfo = await connection.execute(
        `SELECT TOKEN, TO_CHAR(CADUCIDAD, 'DD/MM/YYYY HH24:MI:SS') AS CADUCIDAD FROM API_TOKENS WHERE DOMINIO='MASIVA'`,
        [],
        { outFormat: oracledb.OUT_FORMAT_OBJECT },
      );
      const tokendata = tokeninfo.rows?.[0] as {
        TOKEN: string;
        CADUCIDAD: string;
      };
      return tokendata;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error as string,
      });
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (error) {
          this.logger.error(error);
        }
      }
    }
  }

  async updateSmsToken(token: string) {
    let connection: oracledb.Connection | null = null;
    try {
      connection = await this.dbPool.getConnection();
      await connection.execute(
        `UPDATE API_TOKENS SET TOKEN = :TOKEN, CADUCIDAD = SYSDATE + (1/24)
                WHERE DOMINIO = 'MASIVA'`,
        [token],
      );
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error as string,
      });
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (error) {
          this.logger.error(error);
        }
      }
    }
  }

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
    let connection: oracledb.Connection | null = null;
    try {
      connection = await this.dbPool.getConnection();
      const DATA_RC = JSON.stringify(data);
      await connection.execute(
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
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error as string,
      });
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (error) {
          this.logger.error(error);
        }
      }
    }
  }
}
