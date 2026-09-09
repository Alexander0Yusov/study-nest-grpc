import { Controller } from '@nestjs/common';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';

import {
  CreateTaskRequest,
  CreateTaskResponse,
  GetTaskRequest,
  GetTaskResponse,
  GetTasksPageRequest,
  GetTasksPageResponse,
  StreamTasksRequest,
  Task,
  TASK_SERVICE_NAME,
  TaskServiceController as TaskServiceControllerContract,
  TaskServiceControllerMethods,
  UpdateTaskStatusesResponse,
  UpdateTaskStatusRequest,
  DeleteTaskRequest,
  DeleteTaskResponse,
} from '@app/contracts';

import { TaskService } from './task.service';
import { Observable } from 'rxjs';
import { requireGrpcUserId } from './require-grpc-user-id';

@Controller()
@TaskServiceControllerMethods()
export class TaskController implements TaskServiceControllerContract {
  constructor(private readonly taskService: TaskService) {}

  @GrpcMethod(TASK_SERVICE_NAME, 'CreateTask')
  createTask(
    request: CreateTaskRequest,
    metadata: Metadata,
  ): Promise<CreateTaskResponse> {
    return this.taskService.createTask(request, requireGrpcUserId(metadata));
  }

  @GrpcMethod(TASK_SERVICE_NAME, 'GetTask')
  getTask(
    request: GetTaskRequest,
    metadata: Metadata,
  ): Promise<GetTaskResponse> {
    return this.taskService.getTask(request, requireGrpcUserId(metadata));
  }

  @GrpcMethod(TASK_SERVICE_NAME, 'GetTasksPage')
  getTasksPage(
    request: GetTasksPageRequest,
    metadata: Metadata,
  ): Promise<GetTasksPageResponse> {
    return this.taskService.getTasksPage(request, requireGrpcUserId(metadata));
  }

  @GrpcMethod(TASK_SERVICE_NAME, 'StreamTasks')
  streamTasks(
    _request: StreamTasksRequest,
    metadata: Metadata,
  ): Observable<Task> {
    return this.taskService.streamTasks(requireGrpcUserId(metadata));
  }

  @GrpcStreamMethod(TASK_SERVICE_NAME, 'UpdateTaskStatuses')
  updateTaskStatuses(
    requests: Observable<UpdateTaskStatusRequest>,
    metadata: Metadata,
  ): Observable<UpdateTaskStatusesResponse> {
    return this.taskService.updateTaskStatuses(
      requests,
      requireGrpcUserId(metadata),
    );
  }

  @GrpcStreamMethod(TASK_SERVICE_NAME, 'DeleteTasks')
  deleteTasks(
    requests: Observable<DeleteTaskRequest>,
    metadata: Metadata,
  ): Observable<DeleteTaskResponse> {
    return this.taskService.deleteTasks(requests, requireGrpcUserId(metadata));
  }
}
