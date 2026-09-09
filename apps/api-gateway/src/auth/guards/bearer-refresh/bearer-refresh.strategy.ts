import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

import { authConfig } from '../../../config/auth.config';
import { RefreshTokenPayload } from '../../types/token-payloads';
import { RefreshAuthenticatedPrincipal } from '../../types/refresh-authenticated-principal';
import { BEARER_REFRESH_STRATEGY_NAME } from './bearer-refresh.constants';

type CookieRequest = {
  cookies: Record<string, unknown>;
};

function isCookieRequest(request: unknown): request is CookieRequest {
  return (
    typeof request === 'object' &&
    request !== null &&
    'cookies' in request &&
    typeof request.cookies === 'object' &&
    request.cookies !== null
  );
}

function createRefreshCookieExtractor(
  cookieName: string,
): (request: unknown) => string | null {
  return (request: unknown): string | null => {
    if (!isCookieRequest(request)) {
      return null;
    }

    const value = request.cookies[cookieName];

    return typeof value === 'string' ? value : null;
  };
}

@Injectable()
export class BearerRefreshStrategy extends PassportStrategy(
  Strategy,
  BEARER_REFRESH_STRATEGY_NAME,
) {
  constructor(
    @Inject(authConfig.KEY)
    config: ConfigType<typeof authConfig>,
  ) {
    super({
      jwtFromRequest: createRefreshCookieExtractor(config.refreshCookieName),
      ignoreExpiration: false,
      secretOrKey: config.refreshTokenSecret,
    });
  }

  public validate(payload: unknown): RefreshAuthenticatedPrincipal {
    if (!this.isRefreshTokenPayload(payload)) {
      throw new UnauthorizedException();
    }

    return {
      userId: payload.sub,
      sessionId: payload.sid,
      refreshTokenVersion: payload.version,
    };
  }

  private isRefreshTokenPayload(
    payload: unknown,
  ): payload is RefreshTokenPayload {
    if (typeof payload !== 'object' || payload === null) {
      return false;
    }

    if (
      !('sub' in payload) ||
      !('sid' in payload) ||
      !('type' in payload) ||
      !('version' in payload)
    ) {
      return false;
    }

    const { sub, sid, type, version } = payload;

    return (
      typeof sub === 'number' &&
      Number.isInteger(sub) &&
      sub > 0 &&
      typeof sid === 'number' &&
      Number.isInteger(sid) &&
      sid > 0 &&
      type === 'refresh' &&
      typeof version === 'number' &&
      Number.isInteger(version) &&
      version >= 0
    );
  }
}
