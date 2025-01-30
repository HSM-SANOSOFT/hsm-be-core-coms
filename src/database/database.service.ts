import { Inject, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Connection } from 'oracledb';
import * as oracledb from 'oracledb';

@Injectable()
export class DatabaseService {
  constructor(
    @Inject('DATABASE_CONNECTION') private readonly connection: Connection,
  ) {}

  logger = new Logger('AUTH DATABASE');
  private response = {
    error: (error: string, statusCode = 400) => {
      this.logger.log(`Error al ejecutar la consulta: ${error}`);
      throw new RpcException({
        statusCode,
        message: {
          success: false,
          error: error,
        },
      });
    },
  };

  async getsegundaverificacion(codigo: string, tipo: string) {
    try {
      const result = await this.connection.execute(
        `SELECT COUNT(*) AS NUM FROM PDP_LOG_SEGUNDA_VERIFICACION PV WHERE (PV.PRS_CODIGO=:codigo or PV.CEDULA = :codigo) AND PV.ESTADO='D' AND PV.TIPO= :tipo`,
        [codigo, tipo],
        { outFormat: oracledb.OUT_FORMAT_OBJECT },
      );
      return result.rows.length > 0 ? result.rows[0].NUM : null;
    } catch (error) {
      return this.response.error(
        `Error al ejecutar la consulta: ${error.message}`,
      );
    }
  }

  async getbuscacodigoverificacion(codigo: string) {
    try {
      const result = await this.connection.execute(
        `SELECT PV.NUMERO_ENVIADO FROM PDP_LOG_SEGUNDA_VERIFICACION PV WHERE PV.PRS_CODIGO=:codigo AND PV.ESTADO='D' AND PV.TIPO='C'`,
        [codigo],
        { outFormat: oracledb.OUT_FORMAT_OBJECT },
      );
      return result.rows.length > 0 ? result.rows[0].NUMERO_ENVIADO : null;
    } catch (error) {
      return this.response.error(
        `Error al ejecutar la consulta: ${error.message}`,
      );
    }
  }
}
