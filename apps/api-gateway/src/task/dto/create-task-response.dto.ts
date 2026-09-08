import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const TASK_STATUS_VALUES = [1, 2, 3] as const;

export class ProtobufTimestampResponseDto {
  @ApiProperty({
    example: 1788868800,
    description: 'Seconds since Unix epoch.',
  })
  seconds?: number;

  @ApiProperty({ example: 0, description: 'Nanosecond adjustment.' })
  nanos?: number;
}

export class CreatedTaskResponseDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    minimum: 1,
    maximum: 2_147_483_647,
    example: 1,
  })
  id?: number;

  @ApiProperty({ example: 'Learn gRPC streaming' })
  title?: string;

  @ApiPropertyOptional({ example: 'Verify all four gRPC interaction types' })
  description?: string;

  @ApiProperty({ type: 'number', enum: TASK_STATUS_VALUES, example: 1 })
  status?: number;

  @ApiProperty({ type: ProtobufTimestampResponseDto })
  createdAt?: ProtobufTimestampResponseDto;

  @ApiProperty({ type: ProtobufTimestampResponseDto })
  updatedAt?: ProtobufTimestampResponseDto;
}

export class CreateTaskResponseDto {
  @ApiProperty({ type: CreatedTaskResponseDto })
  task?: CreatedTaskResponseDto;
}
