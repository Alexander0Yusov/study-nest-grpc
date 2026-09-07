import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import {
  CreateTaskResponse,
  TASK_SERVICE_NAME,
  TaskServiceClient,
} from '@app/contracts';

import { CreateTaskRequestDto } from './dto/create-task-request.dto';

@Injectable()
export class TaskService implements OnModuleInit {
  private taskServiceClient!: TaskServiceClient;

  constructor(
    @Inject(TASK_SERVICE_NAME)
    private readonly grpcTaskClient: ClientGrpc,
  ) {}

  onModuleInit(): void {
    this.taskServiceClient =
      this.grpcTaskClient.getService<TaskServiceClient>(TASK_SERVICE_NAME);
  }

  create(dto: CreateTaskRequestDto): Promise<CreateTaskResponse> {
    return firstValueFrom(
      this.taskServiceClient.createTask({
        title: dto.title,
        description: dto.description,
      }),
    );
  }
}
