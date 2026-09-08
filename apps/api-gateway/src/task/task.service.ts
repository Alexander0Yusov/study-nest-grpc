import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import {
  Task,
  CreateTaskResponse,
  TASK_SERVICE_NAME,
  TaskServiceClient,
  UpdateTaskStatusRequest,
  UpdateTaskStatusesResponse,
} from '@app/contracts';

import { CreateTaskRequestDto } from './dto/create-task-request.dto';

import { Logger } from '@nestjs/common';
import { lastValueFrom, tap, toArray, from, map, Observable } from 'rxjs';

import { UpdateTaskStatusesRequestDto } from './dto/update-task-statuses-request.dto';
import { toProtoTaskStatus } from './mappers/task-status.mapper';

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

  updateTaskStatuses(
    dto: UpdateTaskStatusesRequestDto,
  ): Promise<UpdateTaskStatusesResponse> {
    const startedAt = Date.now();
    let sentCount = 0;

    const protoStatus = toProtoTaskStatus(dto.status);

    this.logger.log(
      `[UpdateTaskStatuses] Sending client stream started: messages=${dto.ids.length}`,
    );

    const requests$ = from(dto.ids).pipe(
      map((id): UpdateTaskStatusRequest => ({
        id,
        status: protoStatus,
      })),
      tap({
        next: () => {
          sentCount += 1;
          this.logger.log(`[UpdateTaskStatuses] Sent message ${sentCount}`);
        },
        complete: () => {
          this.logger.log(
            `[UpdateTaskStatuses] Sending completed: messages=${sentCount}`,
          );
        },
      }),
    );

    return firstValueFrom(
      this.taskServiceClient.updateTaskStatuses(requests$).pipe(
        tap({
          next: (response) => {
            this.logger.log(
              `[UpdateTaskStatuses] Response received: requested=${response.requestedCount ?? 0}; updated=${response.updatedCount ?? 0}; durationMs=${Date.now() - startedAt}`,
            );
          },
          error: () => {
            this.logger.error(
              `[UpdateTaskStatuses] Request failed: sent=${sentCount}; durationMs=${Date.now() - startedAt}`,
            );
          },
        }),
      ),
    );
  }
}
