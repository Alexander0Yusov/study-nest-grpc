import type { Task, Timestamp } from '@app/contracts';

import { TaskResponseDto } from '../dto/task-response.dto';
import { toHttpTaskStatus } from './task-status.mapper';

const MAX_TASK_ID = 2_147_483_647;

export function toHttpTaskId(taskId: number | undefined): number {
  if (
    typeof taskId !== 'number' ||
    !Number.isInteger(taskId) ||
    taskId < 1 ||
    taskId > MAX_TASK_ID
  ) {
    throw new Error('Task has an invalid taskId');
  }

  return taskId;
}

function timestampToIso(timestamp: Timestamp | undefined): string {
  const seconds = timestamp?.seconds;
  const nanos = timestamp?.nanos ?? 0;

  if (
    typeof seconds !== 'number' ||
    !Number.isSafeInteger(seconds) ||
    typeof nanos !== 'number' ||
    !Number.isInteger(nanos) ||
    nanos < 0 ||
    nanos > 999_999_999
  ) {
    throw new Error('Task has an invalid timestamp');
  }

  const milliseconds = seconds * 1_000 + Math.floor(nanos / 1_000_000);
  const date = new Date(milliseconds);

  if (Number.isNaN(date.getTime())) {
    throw new Error('Task has an invalid timestamp');
  }

  return date.toISOString();
}

function toHttpTaskTitle(title: string | undefined): string {
  if (typeof title !== 'string') {
    throw new Error('Task has an invalid title');
  }

  return title;
}

function toHttpTaskDescription(
  description: string | undefined,
): string | undefined {
  if (description !== undefined && typeof description !== 'string') {
    throw new Error('Task has an invalid description');
  }

  return description;
}

export function toTaskResponseDto(task: Task): TaskResponseDto {
  return {
    id: toHttpTaskId(task.taskId),
    title: toHttpTaskTitle(task.title),
    description: toHttpTaskDescription(task.description),
    status: toHttpTaskStatus(task.status),
    createdAt: timestampToIso(task.createdAt),
    updatedAt: timestampToIso(task.updatedAt),
  };
}
