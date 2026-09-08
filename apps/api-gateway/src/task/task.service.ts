import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import {
  Task,
  CreateTaskResponse,
  TASK_SERVICE_NAME,
  TaskServiceClient,
} from '@app/contracts';

import { CreateTaskRequestDto } from './dto/create-task-request.dto';

import { Logger } from '@nestjs/common';
import { lastValueFrom, tap, toArray } from 'rxjs';

@Injectable()
export class TaskService implements OnModuleInit {
  private readonly logger = new Logger(TaskService.name);
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

  getTasks(): Promise<Task[]> {
    const startedAt = Date.now();
    let messageCount = 0;

    this.logger.log('[StreamTasks] Receiving stream started');

    return lastValueFrom(
      this.taskServiceClient.streamTasks({}).pipe(
        tap({
          next: () => {
            messageCount += 1;
            this.logger.log(`[StreamTasks] Received message ${messageCount}`);
          },
          complete: () => {
            this.logger.log(
              `[StreamTasks] Receiving completed: messages=${messageCount}; durationMs=${Date.now() - startedAt}`,
            );
          },
          error: () => {
            this.logger.error(
              `[StreamTasks] Receiving failed: messages=${messageCount}; durationMs=${Date.now() - startedAt}`,
            );
          },
        }),

        toArray(),
      ),
    );
  }
}
