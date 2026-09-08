import {
  ArrayMaxSize,
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum UpdateTaskStatus {
  PENDING = 'TASK_STATUS_PENDING',
  IN_PROGRESS = 'TASK_STATUS_IN_PROGRESS',
  COMPLETED = 'TASK_STATUS_COMPLETED',
}

export class UpdateTaskStatusesRequestDto {
  @ApiProperty({
    type: String,
    isArray: true,
    minItems: 1,
    maxItems: 500,
    uniqueItems: true,
    format: 'uuid',
    example: [
      '2b2148e5-97d8-489d-b611-a2d211c95f60',
      '1d865ade-c888-481d-9ee8-f3c308a30133',
    ],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(500)
  @ArrayUnique()
  @IsUUID('4', { each: true })
  ids!: string[];

  @ApiProperty({
    enum: UpdateTaskStatus,
    example: UpdateTaskStatus.COMPLETED,
  })
  @IsEnum(UpdateTaskStatus)
  status!: UpdateTaskStatus;
}
