import { TaskStatus } from '@app/contracts';

export interface TaskResponseDto {
  id?: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
  createdAt?: string;
  updatedAt?: string;
}
