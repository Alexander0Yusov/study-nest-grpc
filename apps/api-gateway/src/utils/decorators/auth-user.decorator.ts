import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

import { AuthenticatedPrincipal } from '../../auth/types/authenticated-principal';

type AuthenticatedFastifyRequest = FastifyRequest & {
  user: AuthenticatedPrincipal;
};

export const AuthUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedPrincipal => {
    const request = context
      .switchToHttp()
      .getRequest<AuthenticatedFastifyRequest>();

    return request.user;
  },
);
