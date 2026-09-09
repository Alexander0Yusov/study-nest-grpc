import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

import { MaxUtf8Bytes } from './max-utf8-bytes.decorator';

export class LoginRequestDto {
  @ApiProperty({ example: 'user@example.com', format: 'email' })
  @Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  public email!: string;

  @ApiProperty({ example: 'strong-password' })
  @IsString()
  @MaxUtf8Bytes(72)
  public password!: string;
}
