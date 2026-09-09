import { Injectable } from '@nestjs/common';

import { UsersService } from '../user/user.service';
import { RegisterRequestDto } from './dto/register-request.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { PasswordHasherService } from './infrastructure/crypto/password-hasher.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly passwordHasher: PasswordHasherService,
    private readonly usersService: UsersService,
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
}
