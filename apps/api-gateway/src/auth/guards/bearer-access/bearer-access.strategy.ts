import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { authConfig } from '../../../config/auth.config';
import { SessionsService } from '../../../session/session.service';
import { AccessTokenPayload } from '../../types/token-payloads';
import { AuthenticatedPrincipal } from '../../types/authenticated-principal';
import { BEARER_ACCESS_STRATEGY_NAME } from './bearer-access.constants';

@Injectable()
export class BearerAccessStrategy extends PassportStrategy(
  Strategy,
  BEARER_ACCESS_STRATEGY_NAME,
) {
  constructor(
    @Inject(authConfig.KEY)
    config: ConfigType<typeof authConfig>,
    private readonly sessionsService: SessionsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.accessTokenSecret,
    });
  }

  public async validate(payload: unknown): Promise<AuthenticatedPrincipal> {
    if (!this.isAccessTokenPayload(payload)) {
      throw new UnauthorizedException();
    }

    const session = await this.sessionsService.findById(payload.sid);

    if (
      !session ||
      session.userId !== payload.sub ||
      !session.isActive(new Date())
    ) {
      throw new UnauthorizedException();
    }

    return {
      userId: payload.sub,
      sessionId: payload.sid,
    };
  }

  private isAccessTokenPayload(
    payload: unknown,
  ): payload is AccessTokenPayload {
    if (typeof payload !== 'object' || payload === null) {
      return false;
    }

    if (!('sub' in payload) || !('sid' in payload) || !('type' in payload)) {
      return false;
    }

    const { sub, sid, type } = payload;

    return (
      typeof sub === 'number' &&
      Number.isInteger(sub) &&
      sub > 0 &&
      typeof sid === 'number' &&
      Number.isInteger(sid) &&
      sid > 0 &&
      type === 'access'
    );
  }
}
