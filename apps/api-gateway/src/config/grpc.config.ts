import { join } from 'node:path';

import { ConfigService } from '@nestjs/config';
import { ClientsProviderAsyncOptions, Transport } from '@nestjs/microservices';

import { STUDY_TASKS_V1_PACKAGE_NAME, TASK_SERVICE_NAME } from '@app/contracts';

const DEFAULT_TASK_SERVICE_HOST = '127.0.0.1:50051';

const validateGrpcHost = (value: string): string => {
  const match = /^([^:\s]+):(\d+)$/.exec(value);

  if (!match) {
    throw new Error(`Invalid GRPC_TASK_SERVICE_HOST: ${value}`);
  }

  const port = Number(match[2]);

  if (port < 1 || port > 65535) {
    throw new Error(`Invalid GRPC_TASK_SERVICE_HOST port: ${port}`);
  }

  return value;
};

export const grpcTaskOptions: ClientsProviderAsyncOptions = {
  name: TASK_SERVICE_NAME,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    transport: Transport.GRPC,
    options: {
      url: validateGrpcHost(
        configService.get<string>('GRPC_TASK_SERVICE_HOST') ??
          DEFAULT_TASK_SERVICE_HOST,
      ),
      package: STUDY_TASKS_V1_PACKAGE_NAME,
      protoPath: join(__dirname, 'proto', 'task', 'v1', 'task.proto'),
    },
  }),
};
