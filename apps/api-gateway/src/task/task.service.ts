import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { firstValueFrom } from 'rxjs';

import {
  Task,
  TASK_SERVICE_NAME,
  TaskServiceClient,
  GetTaskResponse,
  GetTasksPageResponse as GetTasksPageGrpcResponse,
  UpdateTaskStatusRequest,
  UpdateTaskStatusesResponse,
  DeleteTaskRequest,
  GRPC_USER_ID_METADATA_KEY,
} from '@app/contracts';

import { Logger } from '@nestjs/common';
import { lastValueFrom, tap, toArray, from, map } from 'rxjs';

import { CreateTaskRequestDto } from './dto/create-task-request.dto';
import { UpdateTaskStatusesRequestDto } from './dto/update-task-statuses-request.dto';
import { DeleteTasksRequestDto } from './dto/delete-tasks-request.dto';
import { DeleteTasksResponseDto } from './dto/delete-tasks-response.dto';
import { CreateTaskResponseDto } from './dto/create-task-response.dto';
import { GetTasksPageResponseDto } from './dto/get-tasks-page-response.dto';

import { toProtoTaskStatus } from './mappers/task-status.mapper';
import { toDeleteTaskResultDto } from './mappers/delete-task-response.mapper';
import { toTaskResponseDto } from './mappers/task-http.mapper';

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

  async create(
    dto: CreateTaskRequestDto,
    userId: number,
  ): Promise<CreateTaskResponseDto> {
    const metadata = this.createUserMetadata(userId);

    const response = await firstValueFrom(
      this.taskServiceClient.createTask(
        {
          title: dto.title,
          description: dto.description,
        },
        metadata,
      ),
    );

    if (!response.task) {
      throw new Error('CreateTaskResponse has no task');
    }

    return { task: toTaskResponseDto(response.task) };
  }

  async getTask(
    taskId: number,
    userId: number,
  ): Promise<CreateTaskResponseDto> {
    const response: GetTaskResponse = await firstValueFrom(
      this.taskServiceClient.getTask(
        { taskId },
        this.createUserMetadata(userId),
      ),
    );

    if (!response.task) {
      throw new Error('GetTaskResponse has no task');
    }

    return { task: toTaskResponseDto(response.task) };
  }

  async getTasksPage(
    pageNumber: number,
    pageSize: number,
    userId: number,
  ): Promise<GetTasksPageResponseDto> {
    const response: GetTasksPageGrpcResponse = await firstValueFrom(
      this.taskServiceClient.getTasksPage(
        { pageNumber, pageSize },
        this.createUserMetadata(userId),
      ),
    );

    return this.toGetTasksPageResponseDto(response, pageNumber, pageSize);
  }

  getTasks(userId: number): Promise<Task[]> {
    const startedAt = Date.now();
    let messageCount = 0;

    this.logger.log('[StreamTasks] Receiving stream started');

    return lastValueFrom(
      this.taskServiceClient
        .streamTasks({}, this.createUserMetadata(userId))
        .pipe(
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
    userId: number,
  ): Promise<UpdateTaskStatusesResponse> {
    const startedAt = Date.now();
    let sentCount = 0;

    const protoStatus = toProtoTaskStatus(dto.status);

    this.logger.log(
      `[UpdateTaskStatuses] Sending client stream started: messages=${dto.ids.length}`,
    );

    const requests$ = from(dto.ids).pipe(
      map((id): UpdateTaskStatusRequest => ({
        taskId: id,
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
      this.taskServiceClient
        .updateTaskStatuses(requests$, this.createUserMetadata(userId))
        .pipe(
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

  deleteTasks(
    dto: DeleteTasksRequestDto,
    userId: number,
  ): Promise<DeleteTasksResponseDto> {
    const startedAt = Date.now();

    let sentCount = 0;
    let receivedCount = 0;

    this.logger.log(
      `[DeleteTasks] Bidirectional stream started: messages=${dto.ids.length}`,
    );

    const requests$ = from(dto.ids).pipe(
      map((id): DeleteTaskRequest => ({
        taskId: id,
      })),
      tap({
        next: () => {
          sentCount += 1;
          this.logger.log(`[DeleteTasks] Sent message ${sentCount}`);
        },
        complete: () => {
          this.logger.log(
            `[DeleteTasks] Request stream completed: messages=${sentCount}`,
          );
        },
      }),
    );

    return lastValueFrom(
      this.taskServiceClient
        .deleteTasks(requests$, this.createUserMetadata(userId))
        .pipe(
          map((response) => toDeleteTaskResultDto(response)),
          tap({
            next: () => {
              receivedCount += 1;
              this.logger.log(
                `[DeleteTasks] Received response ${receivedCount}`,
              );
            },
            complete: () => {
              this.logger.log(
                `[DeleteTasks] Bidirectional stream completed: sent=${sentCount}; received=${receivedCount}; durationMs=${Date.now() - startedAt}`,
              );
            },
            error: () => {
              this.logger.error(
                `[DeleteTasks] Bidirectional stream failed: sent=${sentCount}; received=${receivedCount}; durationMs=${Date.now() - startedAt}`,
              );
            },
          }),
          toArray(),
          map((results): DeleteTasksResponseDto => ({ results })),
        ),
    );
  }

  private createUserMetadata(userId: number): Metadata {
    if (!Number.isInteger(userId) || userId < 1) {
      throw new Error('Authenticated user has an invalid id');
    }

    const metadata = new Metadata();

    metadata.set(GRPC_USER_ID_METADATA_KEY, userId.toString());

    return metadata;
  }

  private toGetTasksPageResponseDto(
    response: GetTasksPageGrpcResponse,
    requestedPageNumber: number,
    requestedPageSize: number,
  ): GetTasksPageResponseDto {
    const items = response.items ?? [];

    if (!Array.isArray(items)) {
      throw new Error('GetTasksPageResponse has invalid items');
    }

    const pageNumber = this.requirePositiveInt32(
      response.pageNumber,
      'pageNumber',
    );
    const pageSize = this.requirePositiveInt32(response.pageSize, 'pageSize');
    const totalCount = this.requireNonNegativeInt32(
      response.totalCount,
      'totalCount',
    );
    const totalPages = this.requireNonNegativeInt32(
      response.totalPages,
      'totalPages',
    );

    if (
      pageNumber !== requestedPageNumber ||
      pageSize !== requestedPageSize ||
      totalPages !== Math.ceil(totalCount / pageSize)
    ) {
      throw new Error('GetTasksPageResponse has invalid pagination metadata');
    }

    return {
      items: items.map(toTaskResponseDto),
      pageNumber,
      pageSize,
      totalCount,
      totalPages,
    };
  }

  private requirePositiveInt32(
    value: number | undefined,
    field: string,
  ): number {
    if (
      typeof value !== 'number' ||
      !Number.isInteger(value) ||
      value < 1 ||
      value > 2_147_483_647
    ) {
      throw new Error(`GetTasksPageResponse has invalid ${field}`);
    }

    return value;
  }

  private requireNonNegativeInt32(
    value: number | undefined,
    field: string,
  ): number {
    if (
      typeof value !== 'number' ||
      !Number.isInteger(value) ||
      value < 0 ||
      value > 2_147_483_647
    ) {
      throw new Error(`GetTasksPageResponse has invalid ${field}`);
    }

    return value;
  }
}
