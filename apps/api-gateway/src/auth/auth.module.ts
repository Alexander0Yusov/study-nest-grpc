import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { authConfig } from '../config/auth.config';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordHasherService } from './infrastructure/crypto/password-hasher.service';

@Module({
  imports: [ConfigModule.forFeature(authConfig), UserModule],
  controllers: [AuthController],
  providers: [AuthService, PasswordHasherService],
})
export class AuthModule {}
