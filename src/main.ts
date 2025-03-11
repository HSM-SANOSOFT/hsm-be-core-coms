import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { MicroserviceOptions } from '@nestjs/microservices';
import { RpcException, Transport } from '@nestjs/microservices';

import { envs } from '../config';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('COMS');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: envs.HSM_BE_CORE_COMS_HOST,
        port: envs.HSM_BE_CORE_COMS_PORT,
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: true,
      exceptionFactory: errors => {
        return new RpcException(errors);
      },
    }),
  );
  await app.listen();
  logger.log(`Microservice is active on port ${envs.HSM_BE_CORE_COMS_PORT}`);
}
void bootstrap();
