import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum HttpTaskStatus {
  PENDING = 'TASK_STATUS_PENDING',
  IN_PROGRESS = 'TASK_STATUS_IN_PROGRESS',
  COMPLETED = 'TASK_STATUS_COMPLETED',
}

export class TaskResponseDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    minimum: 1,
    maximum: 2_147_483_647,
    example: 1,
  })
  id!: number;

  @ApiProperty({ example: 'Learn gRPC streaming' })
  title!: string;

  @ApiPropertyOptional({
    example: 'Verify all four gRPC interaction types',
    description: 'Omitted from JSON when the task has no description.',
  })
  description?: string;

  @ApiProperty({
    enum: HttpTaskStatus,
    example: HttpTaskStatus.PENDING,
    description: 'Task status value.',
  })
  status!: HttpTaskStatus;

  @ApiProperty({
    format: 'date-time',
    example: '2026-09-08T12:00:00.000Z',
  })
  createdAt!: string;

  @ApiProperty({
    format: 'date-time',
    example: '2026-09-08T12:00:00.000Z',
  })
  updatedAt!: string;
}

export class GetTasksResponseDto {
  @ApiProperty({ type: TaskResponseDto, isArray: true, example: [] })
  items!: TaskResponseDto[];
}
