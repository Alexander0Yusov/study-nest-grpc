import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskStatusesResponseDto {
  @ApiProperty({ example: 2 })
  requestedCount?: number;

  @ApiProperty({ example: 2 })
  updatedCount?: number;
}
