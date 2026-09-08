import type { Task, Timestamp } from '@app/contracts';

import { TaskResponseDto } from '../dto/task-response.dto';

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
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    createdAt: timestampToIso(task.createdAt),
    updatedAt: timestampToIso(task.updatedAt),
  };
}
