import { Task, TaskStatus as ProtoTaskStatus } from '@app/contracts';

import { TaskEntity } from '../entities/task.entity';
import { TaskStatus as PersistenceTaskStatus } from '../enums/task-status.enum';

const taskStatusMap: Record<PersistenceTaskStatus, ProtoTaskStatus> = {
  [PersistenceTaskStatus.PENDING]: ProtoTaskStatus.TASK_STATUS_PENDING,
  [PersistenceTaskStatus.IN_PROGRESS]: ProtoTaskStatus.TASK_STATUS_IN_PROGRESS,
  [PersistenceTaskStatus.COMPLETED]: ProtoTaskStatus.TASK_STATUS_COMPLETED,
};

const MAX_TASK_ID = 2_147_483_647;

function toProtoTaskId(id: number): number {
  if (!Number.isInteger(id) || id < 1 || id > MAX_TASK_ID) {
    throw new Error('Task entity has an invalid id');
  }

  return id;
}

const toTimestamp = (date: Date): NonNullable<Task['createdAt']> => {
  const milliseconds = date.getTime();

  return {
    seconds: Math.floor(milliseconds / 1_000),
    nanos: (milliseconds % 1_000) * 1_000_000,
  };
};

export const toProtoTask = (entity: TaskEntity): Task => ({
  taskId: toProtoTaskId(entity.id),
  title: entity.title,
  description: entity.description ?? undefined,
  status: taskStatusMap[entity.status],
  createdAt: toTimestamp(entity.createdAt),
  updatedAt: toTimestamp(entity.updatedAt),
});
