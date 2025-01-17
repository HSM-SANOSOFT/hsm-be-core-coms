import 'dotenv/config';

import * as dotenv from 'dotenv';
import * as joi from 'joi';
import * as path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '../../../kubernetes/envs/global.env'),
});
dotenv.config({
  path: path.resolve(__dirname, '../../../kubernetes/envs/coms.env'),
});

interface EnvVars {
  COMS_MICROSERVICE_HOST: string;
  COMS_MICROSERVICE_PORT: number;

  DB_USER: string;
  DB_PASSWORD: string;
  DB_CONNECTION_STRING: string;
  ORACLE_CLIENT_PATH: string;

  MAIL_HOST: string;
  MAIL_PORT: string;
  MAIL_USER: string;
  MAIL_PASSWORD: string;
  MAIL_FROM: string;
}

const envsSchema = joi
  .object({
    COMS_MICROSERVICE_HOST: joi.string().default('localhost'),
    COMS_MICROSERVICE_PORT: joi.number().required(),

    DB_USER: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_CONNECTION_STRING: joi.string().required(),
    ORACLE_CLIENT_PATH: joi.string().default('C:/ORACLE/instantclient_12_1'),

    MAIL_HOST: joi.string().required(),
    MAIL_PORT: joi.string().required(),
    MAIL_USER: joi.string().email().required(),
    MAIL_PASSWORD: joi.string().required(),
    MAIL_FROM: joi.string().email().required(),
  })
  .unknown()
  .required();

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  COMS_MICROSERVICE_HOST: envVars.COMS_MICROSERVICE_HOST,
  COMS_MICROSERVICE_PORT: envVars.COMS_MICROSERVICE_PORT,

  DB_USER: envVars.DB_USER,
  DB_PASSWORD: envVars.DB_PASSWORD,
  DB_CONNECTION_STRING: envVars.DB_CONNECTION_STRING,
  ORACLE_CLIENT_PATH: envVars.ORACLE_CLIENT_PATH,

  MAIL_HOST: envVars.MAIL_HOST,
  MAIL_PORT: envVars.MAIL_PORT,
  MAIL_USER: envVars.MAIL_USER,
  MAIL_PASSWORD: envVars.MAIL_PASSWORD,
  MAIL_FROM: envVars.MAIL_FROM,
};
