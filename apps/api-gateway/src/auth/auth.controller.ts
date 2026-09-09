import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Res,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FastifyReply } from 'fastify';

import { GatewayErrorResponseDto } from '../common/swagger/error-response.dto';
import { authConfig } from '../config/auth.config';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterRequestDto } from './dto/register-request.dto';
import { RegisterResponseDto } from './dto/register-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(authConfig.KEY)
    private readonly config: ConfigType<typeof authConfig>,
  ) {}

  @Post('register')
  @ApiOperation({
    operationId: 'registerUser',
    summary: 'Register a user',
  })
  @ApiBody({ type: RegisterRequestDto })
  @ApiCreatedResponse({ type: RegisterResponseDto })
  @ApiBadRequestResponse({ type: GatewayErrorResponseDto })
  @ApiConflictResponse({ type: GatewayErrorResponseDto })
  @ApiInternalServerErrorResponse({ type: GatewayErrorResponseDto })
  public register(
    @Body() dto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: 'loginUser',
    summary: 'Log in and receive an access token',
    description: 'The refresh token is set only in an HttpOnly cookie.',
  })
  @ApiBody({ type: LoginRequestDto })
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiBadRequestResponse({ type: GatewayErrorResponseDto })
  @ApiUnauthorizedResponse({ type: GatewayErrorResponseDto })
  @ApiInternalServerErrorResponse({ type: GatewayErrorResponseDto })
  public async login(
    @Body() dto: LoginRequestDto,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<LoginResponseDto> {
    const result = await this.authService.login(dto);

    reply.setCookie(this.config.refreshCookieName, result.refreshToken, {
      httpOnly: true,
      secure: this.config.cookieSecure,
      sameSite: this.config.cookieSameSite,
      path: this.config.refreshCookiePath,
      expires: result.refreshExpiresAt,
    });

    return { accessToken: result.accessToken };
  }
}
