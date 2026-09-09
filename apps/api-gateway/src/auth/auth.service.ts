import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { authConfig } from '../config/auth.config';
import { SessionsService } from '../session/session.service';
import { UsersService } from '../user/user.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { RegisterRequestDto } from './dto/register-request.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import {
  ACCESS_TOKEN_JWT_SERVICE,
  REFRESH_TOKEN_JWT_SERVICE,
} from './infrastructure/constants/jwt-service.tokens';
import { PasswordHasherService } from './infrastructure/crypto/password-hasher.service';
import { AuthenticatedPrincipal } from './types/authenticated-principal';
import { RefreshAuthenticatedPrincipal } from './types/refresh-authenticated-principal';
import {
  AccessTokenPayload,
  LoginResult,
  RefreshTokenPayload,
} from './types/token-payloads';

@Injectable()
export class AuthService {
  constructor(
    private readonly passwordHasher: PasswordHasherService,
    private readonly usersService: UsersService,
    private readonly sessionsService: SessionsService,

    @Inject(ACCESS_TOKEN_JWT_SERVICE)
    private readonly accessTokenJwtService: JwtService,

    @Inject(REFRESH_TOKEN_JWT_SERVICE)
    private readonly refreshTokenJwtService: JwtService,

    @Inject(authConfig.KEY)
    private readonly config: ConfigType<typeof authConfig>,
  ) {}

  public async register(dto: RegisterRequestDto): Promise<RegisterResponseDto> {
    const passwordHash = await this.passwordHasher.hash(dto.password);
    const user = await this.usersService.create(dto.email, passwordHash);

    return {
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  public async login(dto: LoginRequestDto): Promise<LoginResult> {
    const user = await this.usersService.findByEmailForAuthentication(
      dto.email,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await this.passwordHasher.compare(
      dto.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const now = new Date();

    const refreshExpiresAt = new Date(
      now.getTime() + this.config.refreshTokenTtlSeconds * 1000,
    );

    const session = await this.sessionsService.create(
      user.id,
      now,
      refreshExpiresAt,
    );

    return this.issueTokenPair(
      user.id,
      session.id,
      session.refreshTokenVersion,
      refreshExpiresAt,
    );
  }

  public async refresh(
    principal: RefreshAuthenticatedPrincipal,
  ): Promise<LoginResult> {
    const refreshedAt = new Date();
    const expiresAt = new Date(
      refreshedAt.getTime() + this.config.refreshTokenTtlSeconds * 1000,
    );

    const session = await this.sessionsService.rotateRefreshToken({
      sessionId: principal.sessionId,
      userId: principal.userId,
      expectedVersion: principal.refreshTokenVersion,
      refreshedAt,
      expiresAt,
    });

    if (!session) {
      throw new UnauthorizedException();
    }

    return this.issueTokenPair(
      session.userId,
      session.id,
      session.refreshTokenVersion,
      session.expiresAt,
    );
  }

  public async getCurrentUser(
    principal: AuthenticatedPrincipal,
  ): Promise<RegisterResponseDto> {
    const user = await this.usersService.findById(principal.userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  private async issueTokenPair(
    userId: number,
    sessionId: number,
    refreshTokenVersion: number,
    refreshExpiresAt: Date,
  ): Promise<LoginResult> {
    const accessPayload: AccessTokenPayload = {
      sub: userId,
      sid: sessionId,
      type: 'access',
    };

    const refreshPayload: RefreshTokenPayload = {
      sub: userId,
      sid: sessionId,
      type: 'refresh',
      version: refreshTokenVersion,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.accessTokenJwtService.signAsync(accessPayload),
      this.refreshTokenJwtService.signAsync(refreshPayload),
    ]);

    return {
      accessToken,
      refreshToken,
      refreshExpiresAt,
    };
  }
}
