import { ApiProperty } from '@nestjs/swagger';

export class RegisteredUserResponseDto {
  @ApiProperty({ type: 'integer', format: 'int32', example: 1 })
  public id!: number;

  @ApiProperty({ example: 'user@example.com', format: 'email' })
  public email!: string;
}

export class RegisterResponseDto {
  @ApiProperty({ type: RegisteredUserResponseDto })
  public user!: RegisteredUserResponseDto;
}
