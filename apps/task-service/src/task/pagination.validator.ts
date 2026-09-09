import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';

const MAX_INT32 = 2_147_483_647;
const MAX_PAGE_SIZE = 100;

export function requirePageNumber(value: number | undefined): number {
  if (!isIntegerInRange(value, 1, MAX_INT32)) {
    throwInvalidPaginationRequest();
  }

  return value;
}

export function requirePageSize(value: number | undefined): number {
  if (!isIntegerInRange(value, 1, MAX_PAGE_SIZE)) {
    throwInvalidPaginationRequest();
  }

  return value;
}

function isIntegerInRange(
  value: number | undefined,
  min: number,
  max: number,
): value is number {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= min &&
    value <= max
  );
}

function throwInvalidPaginationRequest(): never {
  throw new RpcException({
    code: status.INVALID_ARGUMENT,
    message: 'Pagination parameters are invalid',
  });
}
