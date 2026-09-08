import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsInt,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteTasksRequestDto {
  @ApiProperty({
    type: 'integer',
    isArray: true,
    minItems: 1,
    maxItems: 500,
    format: 'int32',
    minimum: 1,
    maximum: 2_147_483_647,
    example: [1, 2],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(500)
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Max(2_147_483_647, { each: true })
  ids!: number[];
}
