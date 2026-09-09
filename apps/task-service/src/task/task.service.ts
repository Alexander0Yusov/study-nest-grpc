import { status } from '@grpc/grpc-js';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';

import {
  CreateTaskRequest,
  CreateTaskResponse,
  GetTaskRequest,
  GetTaskResponse,
  GetTasksPageRequest,
  GetTasksPageResponse,
  Task,
  TaskStatus as ProtoTaskStatus,
  UpdateTaskStatusRequest,
  UpdateTaskStatusesResponse,
  DeleteTaskErrorCode,
  DeleteTaskRequest,
  DeleteTaskResponse,
} from '@app/contracts';

import { Repository } from 'typeorm';

import { TaskEntity } from './entities/task.entity';
import { TaskStatus as PersistenceTaskStatus } from './enums/task-status.enum';
import { toProtoTask } from './mappers/task.proto.mapper';
import {
  DeletedTaskRow,
  toTaskEntityFromDeletedRow,
} from './mappers/deleted-task-row.mapper';
import { requireTaskId } from './task-id.validator';
import { requirePageNumber, requirePageSize } from './pagination.validator';

import {
  defer,
  from,
  map,
  mergeMap,
  Observable,
  tap,
  take,
  toArray,
  concatMap,
  of,
} from 'rxjs';

const MAX_STATUS_UPDATE_BATCH_SIZE = 500;

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async createTask(
    request: CreateTaskRequest,
    ownerId: number,
  ): Promise<CreateTaskResponse> {
    const title = request.title?.trim();

    if (!title) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Task title must not be empty',
      });
    }

    const entity = this.taskRepository.create({
      ownerId,
      title,
      description: request.description?.trim() || null,
      status: PersistenceTaskStatus.PENDING,
    });

    const savedTask = await this.taskRepository.save(entity);

    return {
      task: toProtoTask(savedTask),
    };
  }

  async getTask(
    request: GetTaskRequest,
    ownerId: number,
  ): Promise<GetTaskResponse> {
    const taskId = requireTaskId(request.taskId);
    const task = await this.taskRepository.findOne({
      where: { id: taskId, ownerId },
    });

    if (!task) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'Task not found',
      });
    }

    return { task: toProtoTask(task) };
  }

  async getTasksPage(
    request: GetTasksPageRequest,
    ownerId: number,
  ): Promise<GetTasksPageResponse> {
    const pageNumber = requirePageNumber(request.pageNumber);
    const pageSize = requirePageSize(request.pageSize);
    const [tasks, totalCount] = await this.taskRepository.findAndCount({
      where: { ownerId },
      order: { id: 'ASC' },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    return {
      items: tasks.map(toProtoTask),
      pageNumber,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  }

  streamTasks(ownerId: number): Observable<Task> {
    const startedAt = Date.now();
    let sentCount = 0;

    this.logger.log('[StreamTasks] Stream started');

    return defer(() =>
      this.taskRepository.find({
        where: { ownerId },
        order: {
          createdAt: 'ASC',
        },
      }),
    ).pipe(
      mergeMap((entities) => from(entities)),
      map((entity) => toProtoTask(entity)),
      tap({
        next: () => {
          sentCount += 1;
          this.logger.log(`[StreamTasks] Message sent: ${sentCount}`);
        },
        complete: () => {
          this.logger.log(
            `[StreamTasks] Stream completed: messages=${sentCount}; durationMs=${Date.now() - startedAt}`,
          );
        },
        error: () => {
          this.logger.error(
            `[StreamTasks] Stream failed: messages=${sentCount}; durationMs=${Date.now() - startedAt}`,
          );
        },
      }),
    );
  }

  updateTaskStatuses(
    requests$: Observable<UpdateTaskStatusRequest>,
    ownerId: number,
  ): Observable<UpdateTaskStatusesResponse> {
    let receivedCount = 0;

    this.logger.log('[UpdateTaskStatuses] Client stream started');

    return requests$.pipe(
      tap(() => {
        receivedCount += 1;
        this.logger.log(
          `[UpdateTaskStatuses] Received message ${receivedCount}`,
        );
      }),
      take(MAX_STATUS_UPDATE_BATCH_SIZE + 1),
      toArray(),
      mergeMap(async (requests) => {
        return this.processTaskStatusUpdates(requests, ownerId);
      }),
    );
  }

  private async processTaskStatusUpdates(
    requests: UpdateTaskStatusRequest[],
    ownerId: number,
  ): Promise<UpdateTaskStatusesResponse> {
    if (requests.length === 0) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Status update stream must not be empty',
      });
    }

    if (requests.length > MAX_STATUS_UPDATE_BATCH_SIZE) {
      throw new RpcException({
        code: status.RESOURCE_EXHAUSTED,
        message: `Status update batch must not exceed ${MAX_STATUS_UPDATE_BATCH_SIZE} tasks`,
      });
    }

    const ids: number[] = [];
    const uniqueIds = new Set<number>();
    let requestedStatus: ProtoTaskStatus | undefined;

    for (const request of requests) {
      const id = requireTaskId(request.taskId);

      if (uniqueIds.has(id)) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: `Duplicate task id: ${id}`,
        });
      }

      if (
        request.status !== ProtoTaskStatus.TASK_STATUS_PENDING &&
        request.status !== ProtoTaskStatus.TASK_STATUS_IN_PROGRESS &&
        request.status !== ProtoTaskStatus.TASK_STATUS_COMPLETED
      ) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'Every task must contain a supported status',
        });
      }

      if (requestedStatus === undefined) {
        requestedStatus = request.status;
      } else if (request.status !== requestedStatus) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'All tasks in one batch must have the same status',
        });
      }

      uniqueIds.add(id);
      ids.push(id);
    }

    if (requestedStatus === undefined) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Task status is required',
      });
    }

    const persistenceStatus = this.toPersistenceStatus(requestedStatus);

    const result = await this.taskRepository
      .createQueryBuilder()
      .update(TaskEntity)
      .set({ status: persistenceStatus })
      .where('id IN (:...ids)', { ids })
      .andWhere('owner_id = :ownerId', { ownerId })
      .execute();

    const updatedCount = result.affected ?? 0;

    this.logger.log(
      `[UpdateTaskStatuses] Completed: requested=${ids.length}; updated=${updatedCount}`,
    );

    return {
      requestedCount: ids.length,
      updatedCount,
    };
  }

  private toPersistenceStatus(
    statusValue: ProtoTaskStatus,
  ): PersistenceTaskStatus {
    switch (statusValue) {
      case ProtoTaskStatus.TASK_STATUS_PENDING:
        return PersistenceTaskStatus.PENDING;

      case ProtoTaskStatus.TASK_STATUS_IN_PROGRESS:
        return PersistenceTaskStatus.IN_PROGRESS;

      case ProtoTaskStatus.TASK_STATUS_COMPLETED:
        return PersistenceTaskStatus.COMPLETED;

      default:
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'Unsupported task status',
        });
    }
  }

  deleteTasks(
    requests$: Observable<DeleteTaskRequest>,
    ownerId: number,
  ): Observable<DeleteTaskResponse> {
    const startedAt = Date.now();
    const processedIds = new Set<number>();

    let receivedCount = 0;
    let sentCount = 0;

    this.logger.log('[DeleteTasks] Bidirectional stream started');

    return requests$.pipe(
      concatMap((request, index) => {
        receivedCount = index + 1;

        this.logger.log(`[DeleteTasks] Received message ${receivedCount}`);

        if (receivedCount > MAX_STATUS_UPDATE_BATCH_SIZE) {
          throw new RpcException({
            code: status.RESOURCE_EXHAUSTED,
            message: `Delete batch must not exceed ${MAX_STATUS_UPDATE_BATCH_SIZE} tasks`,
          });
        }

        const requestedTaskId = request.taskId ?? 0;
        let taskId: number;

        try {
          taskId = requireTaskId(request.taskId);
        } catch {
          return of(
            this.createDeleteErrorResponse(
              requestedTaskId,
              DeleteTaskErrorCode.DELETE_TASK_ERROR_CODE_INVALID_ARGUMENT,
              'Task id must be a positive int32',
            ),
          );
        }

        if (processedIds.has(taskId)) {
          return of(
            this.createDeleteErrorResponse(
              taskId,
              DeleteTaskErrorCode.DELETE_TASK_ERROR_CODE_DUPLICATE,
              'Task id is duplicated in the stream',
            ),
          );
        }

        processedIds.add(taskId);

        return defer(() => this.deleteTaskById(taskId, ownerId)).pipe(
          map((deletedTask): DeleteTaskResponse => {
            if (!deletedTask) {
              return this.createDeleteErrorResponse(
                taskId,
                DeleteTaskErrorCode.DELETE_TASK_ERROR_CODE_NOT_FOUND,
                'Task not found',
              );
            }

            return {
              requestedTaskId: taskId,
              deletedTask: toProtoTask(deletedTask),
            };
          }),
        );
      }),

      tap({
        next: () => {
          sentCount += 1;
          this.logger.log(`[DeleteTasks] Sent response ${sentCount}`);
        },
        complete: () => {
          this.logger.log(
            `[DeleteTasks] Stream completed: received=${receivedCount}; sent=${sentCount}; durationMs=${Date.now() - startedAt}`,
          );
        },
        error: () => {
          this.logger.error(
            `[DeleteTasks] Stream failed: received=${receivedCount}; sent=${sentCount}; durationMs=${Date.now() - startedAt}`,
          );
        },
      }),
    );
  }

  private async deleteTaskById(
    id: number,
    ownerId: number,
  ): Promise<TaskEntity | undefined> {
    const result = await this.taskRepository
      .createQueryBuilder()
      .delete()
      .from(TaskEntity)
      .where('id = :id', { id })
      .andWhere('owner_id = :ownerId', { ownerId })
      .returning('*')
      .execute();

    const deletedRow = (result.raw as DeletedTaskRow[])[0];

    return deletedRow ? toTaskEntityFromDeletedRow(deletedRow) : undefined;
  }

  private createDeleteErrorResponse(
    requestedTaskId: number,
    code: DeleteTaskErrorCode,
    message: string,
  ): DeleteTaskResponse {
    return {
      requestedTaskId,
      error: {
        code,
        message,
      },
    };
  }
}
