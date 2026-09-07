import { randomUUID } from 'node:crypto';

import { status } from '@grpc/grpc-js';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import {
  CreateTaskRequest,
  CreateTaskResponse,
  Task,
  TaskStatus,
} from '@app/contracts';

function toTimestamp(date: Date): NonNullable<Task['createdAt']> {
  const milliseconds = date.getTime();

  return {
    seconds: Math.floor(milliseconds / 1_000),
    nanos: (milliseconds % 1_000) * 1_000_000,
  };
}

@Injectable()
export class TaskService {
  private readonly tasks = new Map<string, Task>();

  createTask(request: CreateTaskRequest): CreateTaskResponse {
    const title = request.title?.trim();

    if (!title) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Task title must not be empty',
      });
    }

    const id = randomUUID();
    const timestamp = toTimestamp(new Date());
    const description = request.description?.trim() || undefined;

    const task: Task = {
      id,
      title,
      description,
      status: TaskStatus.TASK_STATUS_PENDING,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.tasks.set(id, task);

    return { task };
  }
}
