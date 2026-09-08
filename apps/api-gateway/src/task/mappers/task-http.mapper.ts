import type { Task, Timestamp } from '@app/contracts';

import { TaskResponseDto } from '../dto/task-response.dto';

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

function timestampToIso(timestamp?: Timestamp): string | undefined {
  if (timestamp?.seconds === undefined) {
    return undefined;
  }

  const milliseconds =
    timestamp.seconds * 1_000 + Math.floor((timestamp.nanos ?? 0) / 1_000_000);

  return new Date(milliseconds).toISOString();
}

export function toTaskResponseDto(task: Task): TaskResponseDto {
  return {
    id: toHttpTaskId(task.taskId),
    title: task.title,
    description: task.description,
    status: task.status,
    createdAt: timestampToIso(task.createdAt),
    updatedAt: timestampToIso(task.updatedAt),
  };
}
