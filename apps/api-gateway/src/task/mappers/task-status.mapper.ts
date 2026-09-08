import { TaskStatus as ProtoTaskStatus } from '@app/contracts';

import { UpdateTaskStatus } from '../dto/update-task-statuses-request.dto';
import { HttpTaskStatus } from '../dto/task-response.dto';

const protoStatusByHttpStatus: Record<UpdateTaskStatus, ProtoTaskStatus> = {
  [UpdateTaskStatus.PENDING]: ProtoTaskStatus.TASK_STATUS_PENDING,
  [UpdateTaskStatus.IN_PROGRESS]: ProtoTaskStatus.TASK_STATUS_IN_PROGRESS,
  [UpdateTaskStatus.COMPLETED]: ProtoTaskStatus.TASK_STATUS_COMPLETED,
};

export function toProtoTaskStatus(status: UpdateTaskStatus): ProtoTaskStatus {
  return protoStatusByHttpStatus[status];
}

export function toHttpTaskStatus(
  status: ProtoTaskStatus | undefined,
): HttpTaskStatus {
  switch (status) {
    case ProtoTaskStatus.TASK_STATUS_PENDING:
      return HttpTaskStatus.PENDING;

    case ProtoTaskStatus.TASK_STATUS_IN_PROGRESS:
      return HttpTaskStatus.IN_PROGRESS;

    case ProtoTaskStatus.TASK_STATUS_COMPLETED:
      return HttpTaskStatus.COMPLETED;

    default:
      throw new Error('Task has an unsupported status');
  }
}
