import {
  ArrayMaxSize,
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsUUID,
} from 'class-validator';

export enum UpdateTaskStatus {
  PENDING = 'TASK_STATUS_PENDING',
  IN_PROGRESS = 'TASK_STATUS_IN_PROGRESS',
  COMPLETED = 'TASK_STATUS_COMPLETED',
}

export class UpdateTaskStatusesRequestDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(500)
  @ArrayUnique()
  @IsUUID('4', { each: true })
  ids!: string[];

  @IsEnum(UpdateTaskStatus)
  status!: UpdateTaskStatus;
}
