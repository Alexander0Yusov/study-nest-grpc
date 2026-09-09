import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FastifyReply, FastifyRequest } from 'fastify';

import { GatewayErrorResponseDto } from '../common/swagger/error-response.dto';
import { authConfig } from '../config/auth.config';
import { AuthUser } from '../utils/decorators/auth-user.decorator';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterRequestDto } from './dto/register-request.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { BEARER_ACCESS_STRATEGY_NAME } from './guards/bearer-access/bearer-access.constants';
import { BearerAccessGuard } from './guards/bearer-access/bearer-access.guard';
import { BearerRefreshGuard } from './guards/bearer-refresh/bearer-refresh.guard';
import { AuthenticatedPrincipal } from './types/authenticated-principal';
import { RefreshAuthenticatedPrincipal } from './types/refresh-authenticated-principal';

type RefreshAuthenticatedFastifyRequest = FastifyRequest & {
  user: RefreshAuthenticatedPrincipal;
};

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

    this.setRefreshCookie(reply, result.refreshToken, result.refreshExpiresAt);

    return { accessToken: result.accessToken };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(BearerRefreshGuard)
  @ApiCookieAuth('refresh-token-cookie')
  @ApiOperation({
    operationId: 'refreshAccessToken',
    summary: 'Refresh an access token',
    description: 'The refresh token is read only from an HttpOnly cookie.',
  })
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiUnauthorizedResponse({ type: GatewayErrorResponseDto })
  @ApiInternalServerErrorResponse({ type: GatewayErrorResponseDto })
  public async refresh(
    @Req() request: RefreshAuthenticatedFastifyRequest,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<LoginResponseDto> {
    const result = await this.authService.refresh(request.user);

    this.setRefreshCookie(reply, result.refreshToken, result.refreshExpiresAt);

    return { accessToken: result.accessToken };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(BearerAccessGuard)
  @ApiBearerAuth(BEARER_ACCESS_STRATEGY_NAME)
  @ApiOperation({
    operationId: 'logoutCurrentSession',
    summary: 'Log out the current session',
    description:
      'The current Session is revoked and the refresh cookie is removed.',
  })
  @ApiNoContentResponse({ description: 'The current Session was revoked.' })
  @ApiUnauthorizedResponse({ type: GatewayErrorResponseDto })
  public async logout(
    @AuthUser() user: AuthenticatedPrincipal,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<void> {
    await this.authService.logout(user);
    this.clearRefreshCookie(reply);
  }

  @Get('me')
  @UseGuards(BearerAccessGuard)
  @ApiBearerAuth(BEARER_ACCESS_STRATEGY_NAME)
  @ApiOperation({
    operationId: 'getCurrentUser',
    summary: 'Get the authenticated user',
  })
  @ApiOkResponse({ type: RegisterResponseDto })
  @ApiUnauthorizedResponse({ type: GatewayErrorResponseDto })
  public getCurrentUser(
    @AuthUser() user: AuthenticatedPrincipal,
  ): Promise<RegisterResponseDto> {
    return this.authService.getCurrentUser(user);
  }

  private setRefreshCookie(
    reply: FastifyReply,
    refreshToken: string,
    refreshExpiresAt: Date,
  ): void {
    reply.setCookie(this.config.refreshCookieName, refreshToken, {
      httpOnly: true,
      secure: this.config.cookieSecure,
      sameSite: this.config.cookieSameSite,
      path: this.config.refreshCookiePath,
      expires: refreshExpiresAt,
    });
  }

  private clearRefreshCookie(reply: FastifyReply): void {
    reply.clearCookie(this.config.refreshCookieName, {
      httpOnly: true,
      secure: this.config.cookieSecure,
      sameSite: this.config.cookieSameSite,
      path: this.config.refreshCookiePath,
    });
  }
}
