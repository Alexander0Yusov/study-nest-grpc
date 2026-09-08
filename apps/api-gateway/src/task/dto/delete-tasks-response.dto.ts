import { TaskResponseDto } from './task-response.dto';

export enum DeleteTaskErrorResponseCode {
  NOT_FOUND = 'NOT_FOUND',
  INVALID_ARGUMENT = 'INVALID_ARGUMENT',
  DUPLICATE = 'DUPLICATE',
}

export interface DeletedTaskResultDto {
  requestedId: string;
  deletedTask: TaskResponseDto;
}

export interface DeleteTaskErrorResultDto {
  requestedId: string;
  error: {
    code: DeleteTaskErrorResponseCode;
    message: string;
  };
}

export type DeleteTaskResultDto =
  DeletedTaskResultDto | DeleteTaskErrorResultDto;

export interface DeleteTasksResponseDto {
  results: DeleteTaskResultDto[];
}
