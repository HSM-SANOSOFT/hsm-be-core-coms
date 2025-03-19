import 'dotenv/config';

import * as joi from 'joi';

interface EnvVars {
  DB_USER: string;
  DB_PASSWORD: string;
  DB_CONNECTION_STRING: string;
  LD_LIBRARY_PATH: string;

  MAIL_NAME: string;
  MAIL_API_KEY: string;

  MASIVA_URL: string;
  MASIVA_CLIENT_ID: string;
  MASIVA_CLIENT_SECRET: string;
}

const envsSchema = joi
  .object({
    DB_USER: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_CONNECTION_STRING: joi.string().required(),
    LD_LIBRARY_PATH: joi.string().default('C:/ORACLE/instantclient_12_1'),

    MAIL_NAME: joi.string().required(),
    MAIL_API_KEY: joi.string().required(),

    MASIVA_URL: joi.string().required(),
    MASIVA_CLIENT_ID: joi.string().required(),
    MASIVA_CLIENT_SECRET: joi.string().required(),
  })
  .unknown()
  .required();

const validationSchema = envsSchema.validate(process.env);

if (validationSchema.error) {
  throw new Error(`Config validation error: ${validationSchema.error.message}`);
}

const envVars: EnvVars = validationSchema.value as EnvVars;

export const envs = {
  DB_USER: envVars.DB_USER,
  DB_PASSWORD: envVars.DB_PASSWORD,
  DB_CONNECTION_STRING: envVars.DB_CONNECTION_STRING,
  LD_LIBRARY_PATH: envVars.LD_LIBRARY_PATH,

  MAIL_NAME: envVars.MAIL_NAME,
  MAIL_API_KEY: envVars.MAIL_API_KEY,

  MASIVA_URL: envVars.MASIVA_URL,
  MASIVA_CLIENT_ID: envVars.MASIVA_CLIENT_ID,
  MASIVA_CLIENT_SECRET: envVars.MASIVA_CLIENT_SECRET,
};
