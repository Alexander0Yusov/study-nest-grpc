import {
  ArrayMaxSize,
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteTasksRequestDto {
  @ApiProperty({
    type: String,
    isArray: true,
    minItems: 1,
    maxItems: 500,
    uniqueItems: true,
    format: 'uuid',
    example: [
      '2b2148e5-97d8-489d-b611-a2d211c95f60',
      '00000000-0000-4000-8000-000000000001',
    ],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(500)
  @ArrayUnique()
  @IsUUID('4', { each: true })
  ids!: string[];
}
