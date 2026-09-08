import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskRequestDto {
  @ApiProperty({
    example: 'Learn gRPC streaming',
    minLength: 1,
    maxLength: 120,
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  public title!: string;

  @ApiPropertyOptional({
    example: 'Verify all four gRPC interaction types',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  public description?: string;
}
