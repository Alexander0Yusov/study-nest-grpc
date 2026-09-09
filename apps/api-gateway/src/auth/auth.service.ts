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

    const accessPayload: AccessTokenPayload = {
      sub: user.id,
      sid: session.id,
      type: 'access',
    };

    const refreshPayload: RefreshTokenPayload = {
      sub: user.id,
      sid: session.id,
      type: 'refresh',
      version: session.refreshTokenVersion,
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
