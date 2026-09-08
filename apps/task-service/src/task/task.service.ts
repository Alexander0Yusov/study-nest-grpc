import { status } from '@grpc/grpc-js';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';

import { CreateTaskRequest, CreateTaskResponse } from '@app/contracts';

import { Repository } from 'typeorm';

import { TaskEntity } from './entities/task.entity';
import { TaskStatus } from './enums/task-status.enum';
import { toProtoTask } from './mappers/task.proto.mapper';

@Injectable()
export class TaskService {
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
}
