import { Transform } from 'class-transformer';
import {
  IsByteLength,
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { passwordConstraints } from '../constants/password.constraints';

export class RegisterRequestDto {
  @ApiProperty({ example: 'user@example.com', format: 'email' })
  @Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  public email!: string;

  @ApiProperty({
    format: 'password',
    minLength: passwordConstraints.minLength,
    maxLength: passwordConstraints.maxLength,
    description: 'Maximum 72 UTF-8 bytes.',
  })
  @IsString()
  @MinLength(passwordConstraints.minLength)
  @MaxLength(passwordConstraints.maxLength)
  @IsByteLength(0, passwordConstraints.maxUtf8Bytes, {
    message: 'password must not exceed 72 UTF-8 bytes',
  })
  public password!: string;
}
