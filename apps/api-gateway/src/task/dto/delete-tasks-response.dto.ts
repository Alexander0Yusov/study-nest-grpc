import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';

import { TaskResponseDto } from './task-response.dto';

export enum DeleteTaskErrorResponseCode {
  NOT_FOUND = 'NOT_FOUND',
  INVALID_ARGUMENT = 'INVALID_ARGUMENT',
  DUPLICATE = 'DUPLICATE',
}

export class DeleteTaskErrorDto {
  @ApiProperty({
    enum: DeleteTaskErrorResponseCode,
    example: DeleteTaskErrorResponseCode.NOT_FOUND,
  })
  code!: DeleteTaskErrorResponseCode;

  @ApiProperty({ example: 'Task not found' })
  message!: string;
}

export class DeletedTaskResultDto {
  @ApiProperty({
    format: 'uuid',
    example: '2b2148e5-97d8-489d-b611-a2d211c95f60',
  })
  requestedId!: string;

  @ApiProperty({ type: TaskResponseDto })
  deletedTask!: TaskResponseDto;
}

export class DeleteTaskErrorResultDto {
  @ApiProperty({
    format: 'uuid',
    example: '00000000-0000-4000-8000-000000000001',
  })
  requestedId!: string;

  @ApiProperty({ type: DeleteTaskErrorDto })
  error!: DeleteTaskErrorDto;
}

export type DeleteTaskResultDto =
  DeletedTaskResultDto | DeleteTaskErrorResultDto;

@ApiExtraModels(DeletedTaskResultDto, DeleteTaskErrorResultDto)
export class DeleteTasksResponseDto {
  @ApiProperty({
    type: 'array',
    items: {
      oneOf: [
        { $ref: getSchemaPath(DeletedTaskResultDto) },
        { $ref: getSchemaPath(DeleteTaskErrorResultDto) },
      ],
    },
  })
  results!: DeleteTaskResultDto[];
}
