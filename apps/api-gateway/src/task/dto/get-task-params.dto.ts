import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetTaskParamsDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    minimum: 1,
    maximum: 2_147_483_647,
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(2_147_483_647)
  taskId!: number;
}
