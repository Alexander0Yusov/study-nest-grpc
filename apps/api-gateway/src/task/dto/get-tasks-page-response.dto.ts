import { ApiProperty } from '@nestjs/swagger';

import { TaskResponseDto } from './task-response.dto';

export class GetTasksPageResponseDto {
  @ApiProperty({ type: TaskResponseDto, isArray: true, example: [] })
  items!: TaskResponseDto[];

  @ApiProperty({ type: 'integer', format: 'int32', minimum: 1, example: 1 })
  pageNumber!: number;

  @ApiProperty({ type: 'integer', format: 'int32', minimum: 1, example: 20 })
  pageSize!: number;

  @ApiProperty({ type: 'integer', format: 'int32', minimum: 0, example: 1 })
  totalCount!: number;

  @ApiProperty({ type: 'integer', format: 'int32', minimum: 0, example: 1 })
  totalPages!: number;
}
