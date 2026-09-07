import { status as GrpcStatus } from '@grpc/grpc-js';
import { ArgumentsHost, Catch, Logger } from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';

import { Observable } from 'rxjs';

@Catch()
export class RpcExceptionFilter extends BaseRpcExceptionFilter {
  private readonly logger = new Logger(RpcExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): Observable<never> {
    if (exception instanceof RpcException) {
      return super.catch(exception, host) as Observable<never>;
    }

    const contextType = host.getType();
    const stack = exception instanceof Error ? exception.stack : undefined;

    this.logger.error(`Unhandled ${contextType} error`, stack);

    const internalException = new RpcException({
      code: GrpcStatus.INTERNAL,
      message: 'Internal server error',
    });

    return super.catch(internalException, host) as Observable<never>;
  }
}
