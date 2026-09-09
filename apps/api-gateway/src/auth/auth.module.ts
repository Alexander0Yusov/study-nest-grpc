import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { authConfig } from '../config/auth.config';
import { SessionModule } from '../session/session.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordHasherService } from './infrastructure/crypto/password-hasher.service';
import { BearerAccessGuard } from './guards/bearer-access/bearer-access.guard';
import { BearerAccessStrategy } from './guards/bearer-access/bearer-access.strategy';
import { BearerRefreshGuard } from './guards/bearer-refresh/bearer-refresh.guard';
import { BearerRefreshStrategy } from './guards/bearer-refresh/bearer-refresh.strategy';
import {
  ACCESS_TOKEN_JWT_SERVICE,
  REFRESH_TOKEN_JWT_SERVICE,
} from './infrastructure/constants/jwt-service.tokens';

@Module({
  imports: [
    ConfigModule.forFeature(authConfig),
    PassportModule,
    UserModule,
    SessionModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordHasherService,
    BearerAccessStrategy,
    BearerAccessGuard,
    BearerRefreshStrategy,
    BearerRefreshGuard,
    {
      provide: ACCESS_TOKEN_JWT_SERVICE,
      useFactory: (config: ConfigType<typeof authConfig>): JwtService =>
        new JwtService({
          secret: config.accessTokenSecret,
          signOptions: { expiresIn: config.accessTokenTtlSeconds },
        }),
      inject: [authConfig.KEY],
    },
    {
      provide: REFRESH_TOKEN_JWT_SERVICE,
      useFactory: (config: ConfigType<typeof authConfig>): JwtService =>
        new JwtService({
          secret: config.refreshTokenSecret,
          signOptions: { expiresIn: config.refreshTokenTtlSeconds },
        }),
      inject: [authConfig.KEY],
    },
  ],
})
export class AuthModule {}
