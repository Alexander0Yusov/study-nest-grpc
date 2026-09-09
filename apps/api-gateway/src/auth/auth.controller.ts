import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { GatewayErrorResponseDto } from '../common/swagger/error-response.dto';
import { AuthService } from './auth.service';
import { RegisterRequestDto } from './dto/register-request.dto';
import { RegisterResponseDto } from './dto/register-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
