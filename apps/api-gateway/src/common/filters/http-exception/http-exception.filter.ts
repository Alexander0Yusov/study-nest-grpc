import { status as GrpcStatus } from '@grpc/grpc-js';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { FastifyReply, FastifyRequest } from 'fastify';

import { grpcStatusToHttpStatus } from './grpc-status-to-http-status.mapper';

type ErrorMessage = string | string[];

type NestExceptionResponse = {
  message?: ErrorMessage;
};

type GrpcError = {
  code: number;
  details: string;
  message?: string;
  stack?: string;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();

    const request = context.getRequest<FastifyRequest>();
    const response = context.getResponse<FastifyReply>();

    if (this.isGrpcError(exception)) {
      this.handleGrpcError(exception, request, response);
      return;
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = this.getHttpMessage(exception);
    const error =
      HttpStatus[status] ?? HttpStatus[HttpStatus.INTERNAL_SERVER_ERROR];

    if (!(exception instanceof HttpException)) {
      const stack = exception instanceof Error ? exception.stack : undefined;

      this.logger.error(
        `Unhandled error: ${request.method} ${request.url}`,
        stack,
      );
    }

    response.status(status).send({
      statusCode: status,
      message,
      error,
    });
  }

  private handleGrpcError(
    exception: GrpcError,
    request: FastifyRequest,
    response: FastifyReply,
  ): void {
    const status = grpcStatusToHttpStatus(exception.code);
    const message = this.getGrpcMessage(exception);
    const error =
      HttpStatus[status] ?? HttpStatus[HttpStatus.INTERNAL_SERVER_ERROR];

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `gRPC error: ${request.method} ${request.url}; code=${exception.code}`,
        exception.stack,
      );
    }

    response.status(status).send({
      statusCode: status,
      message,
      error,
    });
  }

  private getHttpMessage(exception: unknown): ErrorMessage {
    if (!(exception instanceof HttpException)) {
      return 'Internal server error';
    }

    const exceptionResponse = exception.getResponse();

    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }

    const response = exceptionResponse as NestExceptionResponse;

    return response.message ?? exception.message;
  }

  private getGrpcMessage(exception: GrpcError): string {
    switch (exception.code) {
      case GrpcStatus.UNAVAILABLE:
        return 'Task service is unavailable';

      case GrpcStatus.DEADLINE_EXCEEDED:
        return 'Task service request timed out';

      case GrpcStatus.UNKNOWN:
      case GrpcStatus.INTERNAL:
      case GrpcStatus.DATA_LOSS:
        return 'Internal server error';

      default:
        return exception.details || 'gRPC request failed';
    }
  }

  private isGrpcError(exception: unknown): exception is GrpcError {
    if (typeof exception !== 'object' || exception === null) {
      return false;
    }

    const candidate = exception as Partial<GrpcError>;

    return (
      typeof candidate.code === 'number' &&
      typeof candidate.details === 'string'
    );
  }
}
