import { Controller } from '@nestjs/common';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';

import {
  CreateTaskRequest,
  CreateTaskResponse,
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

@Controller()
@TaskServiceControllerMethods()
export class TaskController implements TaskServiceControllerContract {
  constructor(private readonly taskService: TaskService) {}

  @GrpcMethod(TASK_SERVICE_NAME, 'CreateTask')
  createTask(request: CreateTaskRequest): Promise<CreateTaskResponse> {
    return this.taskService.createTask(request);
  }

  @GrpcMethod(TASK_SERVICE_NAME, 'StreamTasks')
  streamTasks(_request: StreamTasksRequest): Observable<Task> {
    return this.taskService.streamTasks();
  }

  @GrpcStreamMethod(TASK_SERVICE_NAME, 'UpdateTaskStatuses')
  updateTaskStatuses(
    requests: Observable<UpdateTaskStatusRequest>,
  ): Observable<UpdateTaskStatusesResponse> {
    return this.taskService.updateTaskStatuses(requests);
  }

  @GrpcStreamMethod(TASK_SERVICE_NAME, 'DeleteTasks')
  deleteTasks(
    requests: Observable<DeleteTaskRequest>,
  ): Observable<DeleteTaskResponse> {
    return this.taskService.deleteTasks(requests);
  }
}
