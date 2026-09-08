import { status } from '@grpc/grpc-js';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';

import { CreateTaskRequest, CreateTaskResponse, Task } from '@app/contracts';

import { Repository } from 'typeorm';

import { TaskEntity } from './entities/task.entity';
import { TaskStatus } from './enums/task-status.enum';
import { toProtoTask } from './mappers/task.proto.mapper';

import { defer, from, map, mergeMap, Observable, tap } from 'rxjs';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async createTask(request: CreateTaskRequest): Promise<CreateTaskResponse> {
    const title = request.title?.trim();

    if (!title) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Task title must not be empty',
      });
    }

    const entity = this.taskRepository.create({
      title,
      description: request.description?.trim() || null,
      status: TaskStatus.PENDING,
    });

    const savedTask = await this.taskRepository.save(entity);

    return {
      task: toProtoTask(savedTask),
    };
  }

  streamTasks(): Observable<Task> {
    const startedAt = Date.now();
    let sentCount = 0;

    this.logger.log('[StreamTasks] Stream started');

    return defer(() =>
      this.taskRepository.find({
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
}
