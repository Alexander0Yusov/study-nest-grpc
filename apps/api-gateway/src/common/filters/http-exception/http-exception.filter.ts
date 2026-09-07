import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { FastifyReply, FastifyRequest } from 'fastify';

type ErrorMessage = string | string[];

type NestExceptionResponse = {
  message?: ErrorMessage;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();

    const request = context.getRequest<FastifyRequest>();
    const response = context.getResponse<FastifyReply>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = this.getMessage(exception);
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

  private getMessage(exception: unknown): ErrorMessage {
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
}
