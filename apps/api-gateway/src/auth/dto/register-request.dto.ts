import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { MaxUtf8Bytes } from './max-utf8-bytes.decorator';

export class RegisterRequestDto {
  @ApiProperty({ example: 'user@example.com', format: 'email' })
  @Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  public email!: string;

  @ApiProperty({
    example: 'strong-password',
    minLength: 8,
    maxLength: 64,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  @MaxUtf8Bytes(72)
  public password!: string;
}
