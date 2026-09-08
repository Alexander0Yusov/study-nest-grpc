import type { CreateTaskResponse } from '@app/contracts';

import {
  CreateTaskResponseDto,
  CreatedTaskResponseDto,
} from '../dto/create-task-response.dto';
import { toHttpTaskId } from './task-http.mapper';

export function toCreateTaskResponseDto(
  response: CreateTaskResponse,
): CreateTaskResponseDto {
  const task = response.task;

  if (!task) {
    throw new Error('CreateTaskResponse has no task');
  }

  const httpTask: CreatedTaskResponseDto = {
    id: toHttpTaskId(task.taskId),
    title: task.title,
    description: task.description,
    status: task.status,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };

  return { task: httpTask };
}
