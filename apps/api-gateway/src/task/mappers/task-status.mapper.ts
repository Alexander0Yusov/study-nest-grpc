import { TaskStatus as ProtoTaskStatus } from '@app/contracts';

import { UpdateTaskStatus } from '../dto/update-task-statuses-request.dto';

const protoStatusByHttpStatus: Record<UpdateTaskStatus, ProtoTaskStatus> = {
  [UpdateTaskStatus.PENDING]: ProtoTaskStatus.TASK_STATUS_PENDING,
  [UpdateTaskStatus.IN_PROGRESS]: ProtoTaskStatus.TASK_STATUS_IN_PROGRESS,
  [UpdateTaskStatus.COMPLETED]: ProtoTaskStatus.TASK_STATUS_COMPLETED,
};

export function toProtoTaskStatus(status: UpdateTaskStatus): ProtoTaskStatus {
  return protoStatusByHttpStatus[status];
}
