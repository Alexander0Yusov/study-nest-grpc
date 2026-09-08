import { DeleteTaskErrorCode, DeleteTaskResponse } from '@app/contracts';

import {
  DeleteTaskErrorResponseCode,
  DeleteTaskResultDto,
} from '../dto/delete-tasks-response.dto';
import { toHttpTaskId, toTaskResponseDto } from './task-http.mapper';

function toHttpErrorCode(
  code: DeleteTaskErrorCode | undefined,
): DeleteTaskErrorResponseCode {
  switch (code) {
    case DeleteTaskErrorCode.DELETE_TASK_ERROR_CODE_NOT_FOUND:
      return DeleteTaskErrorResponseCode.NOT_FOUND;

    case DeleteTaskErrorCode.DELETE_TASK_ERROR_CODE_INVALID_ARGUMENT:
      return DeleteTaskErrorResponseCode.INVALID_ARGUMENT;

    case DeleteTaskErrorCode.DELETE_TASK_ERROR_CODE_DUPLICATE:
      return DeleteTaskErrorResponseCode.DUPLICATE;

    default:
      throw new Error('Invalid delete task error code');
  }
}

export function toDeleteTaskResultDto(
  response: DeleteTaskResponse,
): DeleteTaskResultDto {
  const requestedId = toHttpTaskId(response.requestedTaskId);
  const deletedTask = response.deletedTask;
  const error = response.error;

  if (deletedTask && !error) {
    return {
      requestedId,
      deletedTask: toTaskResponseDto(deletedTask),
    };
  }

  if (error && !deletedTask) {
    return {
      requestedId,
      error: {
        code: toHttpErrorCode(error.code),
        message: error.message ?? 'Delete failed',
      },
    };
  }

  throw new Error('DeleteTaskResponse must contain exactly one result');
}
