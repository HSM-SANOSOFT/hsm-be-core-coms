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
  HSM_CORE_COMS_NAME: string;
  HSM_CORE_COMS_HOST: string;
  HSM_CORE_COMS_PORT: number;

  DB_USER: string;
  DB_PASSWORD: string;
  DB_CONNECTION_STRING: string;
  LD_LIBRARY_PATH: string;

  MAIL_HOST: string;
  MAIL_PORT: string;
  MAIL_USER: string;
  MAIL_PASSWORD: string;
  MAIL_FROM: string;

  MASIVA_URL: string;
  MASIVA_CLIENT_ID: string;
  MASIVA_CLIENT_SECRET: string;
}

const envsSchema = joi
  .object({
    HSM_CORE_COMS_NAME: joi.string().required(),
    HSM_CORE_COMS_HOST: joi.string().default('localhost'),
    HSM_CORE_COMS_PORT: joi.number().required(),

    DB_USER: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_CONNECTION_STRING: joi.string().required(),
    LD_LIBRARY_PATH: joi.string().default('C:/ORACLE/instantclient_12_1'),

    MAIL_HOST: joi.string().required(),
    MAIL_PORT: joi.string().required(),
    MAIL_USER: joi.string().email().required(),
    MAIL_PASSWORD: joi.string().required(),
    MAIL_FROM: joi.string().email().required(),

    MASIVA_URL: joi.string().required(),
    MASIVA_CLIENT_ID: joi.string().required(),
    MASIVA_CLIENT_SECRET: joi.string().required(),
  })
  .unknown()
  .required();

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  HSM_CORE_COMS_NAME: envVars.HSM_CORE_COMS_NAME,
  HSM_CORE_COMS_HOST: envVars.HSM_CORE_COMS_HOST,
  HSM_CORE_COMS_PORT: envVars.HSM_CORE_COMS_PORT,

  DB_USER: envVars.DB_USER,
  DB_PASSWORD: envVars.DB_PASSWORD,
  DB_CONNECTION_STRING: envVars.DB_CONNECTION_STRING,
  LD_LIBRARY_PATH: envVars.LD_LIBRARY_PATH,

  MAIL_HOST: envVars.MAIL_HOST,
  MAIL_PORT: envVars.MAIL_PORT,
  MAIL_USER: envVars.MAIL_USER,
  MAIL_PASSWORD: envVars.MAIL_PASSWORD,
  MAIL_FROM: envVars.MAIL_FROM,

  MASIVA_URL: envVars.MASIVA_URL,
  MASIVA_CLIENT_ID: envVars.MASIVA_CLIENT_ID,
  MASIVA_CLIENT_SECRET: envVars.MASIVA_CLIENT_SECRET,
};
