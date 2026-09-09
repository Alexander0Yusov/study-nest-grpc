import { Metadata, status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';

import { GRPC_USER_ID_METADATA_KEY } from '@app/contracts';

const MAX_POSTGRES_INTEGER = 2_147_483_647;

export function requireGrpcUserId(metadata: Metadata | undefined): number {
  if (!metadata) {
    throwUnauthenticated();
  }

  const values = metadata.get(GRPC_USER_ID_METADATA_KEY);

  if (values.length !== 1 || typeof values[0] !== 'string') {
    throwUnauthenticated();
  }

  const value = values[0];

  if (!/^[1-9]\d*$/.test(value)) {
    throwUnauthenticated();
  }

  const userId = Number(value);

  if (
    !Number.isSafeInteger(userId) ||
    userId < 1 ||
    userId > MAX_POSTGRES_INTEGER
  ) {
    throwUnauthenticated();
  }

  return userId;
}

function throwUnauthenticated(): never {
  throw new RpcException({
    code: status.UNAUTHENTICATED,
    message: 'Unauthenticated',
  });
}
