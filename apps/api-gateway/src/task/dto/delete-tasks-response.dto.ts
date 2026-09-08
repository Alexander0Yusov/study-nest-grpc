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
    type: 'integer',
    format: 'int32',
    minimum: 1,
    maximum: 2_147_483_647,
    example: 1,
  })
  requestedId!: number;

  @ApiProperty({ type: TaskResponseDto })
  deletedTask!: TaskResponseDto;
}

export class DeleteTaskErrorResultDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    minimum: 1,
    maximum: 2_147_483_647,
    example: 2,
  })
  requestedId!: number;

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
