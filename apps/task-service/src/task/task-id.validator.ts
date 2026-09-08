import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';

const MAX_TASK_ID = 2_147_483_647;

export function requireTaskId(value: number | undefined): number {
  if (
    typeof value !== 'number' ||
    !Number.isInteger(value) ||
    value < 1 ||
    value > MAX_TASK_ID
  ) {
    throw new RpcException({
      code: status.INVALID_ARGUMENT,
      message: 'Task id must be a positive int32',
    });
  }

  return value;
}
