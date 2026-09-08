import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const TASK_STATUS_VALUES = [1, 2, 3] as const;

export class TaskResponseDto {
  @ApiProperty({
    format: 'uuid',
    example: '2b2148e5-97d8-489d-b611-a2d211c95f60',
  })
  id?: string;

  @ApiProperty({ example: 'Learn gRPC streaming' })
  title?: string;

  @ApiPropertyOptional({
    example: 'Verify all four gRPC interaction types',
    description: 'Omitted from JSON when the task has no description.',
  })
  description?: string;

  @ApiProperty({
    type: 'number',
    enum: TASK_STATUS_VALUES,
    example: 3,
    description:
      'Numeric protobuf TaskStatus value: 1 = PENDING, 2 = IN_PROGRESS, 3 = COMPLETED.',
  })
  status?: number;

  @ApiPropertyOptional({
    format: 'date-time',
    example: '2026-09-08T12:00:00.000Z',
  })
  createdAt?: string;

  @ApiPropertyOptional({
    format: 'date-time',
    example: '2026-09-08T12:00:00.000Z',
  })
  updatedAt?: string;
}

export class GetTasksResponseDto {
  @ApiProperty({ type: TaskResponseDto, isArray: true, example: [] })
  items!: TaskResponseDto[];
}
