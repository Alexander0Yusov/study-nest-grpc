import { join } from 'node:path';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { STUDY_TASKS_V1_PACKAGE_NAME } from '@app/contracts';

import { loadTaskServiceConfig } from './config/task-service.config';
import { TaskServiceModule } from './task-service.module';

const logger = new Logger('TaskServiceBootstrap');

async function bootstrap(): Promise<void> {
  const { grpcUrl } = loadTaskServiceConfig();

  const protoPath = join(__dirname, 'proto', 'task', 'v1', 'task.proto');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    TaskServiceModule,
    {
      transport: Transport.GRPC,
      options: {
        url: grpcUrl,
        package: STUDY_TASKS_V1_PACKAGE_NAME,
        protoPath,
      },
    },
  );

  await app.listen();

  logger.log(`Task service is listening via gRPC on ${grpcUrl}`);
}

void bootstrap();
