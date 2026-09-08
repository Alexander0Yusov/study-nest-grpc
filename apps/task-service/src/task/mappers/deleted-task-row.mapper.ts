import { TaskEntity } from '../entities/task.entity';
import { TaskStatus as PersistenceTaskStatus } from '../enums/task-status.enum';

export interface DeletedTaskRow {
  id: number;
  title: string;
  description: string | null;
  status: PersistenceTaskStatus;
  created_at: Date | string;
  updated_at: Date | string;
}

export function toTaskEntityFromDeletedRow(row: DeletedTaskRow): TaskEntity {
  const entity = new TaskEntity();

  entity.id = row.id;
  entity.title = row.title;
  entity.description = row.description;
  entity.status = row.status;
  entity.createdAt =
    row.created_at instanceof Date ? row.created_at : new Date(row.created_at);
  entity.updatedAt =
    row.updated_at instanceof Date ? row.updated_at : new Date(row.updated_at);

  return entity;
}
