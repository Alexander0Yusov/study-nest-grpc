import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import {
  CreateTaskRequest,
  CreateTaskResponse,
  StreamTasksRequest,
  Task,
  TASK_SERVICE_NAME,
  TaskServiceController as TaskServiceControllerContract,
  TaskServiceControllerMethods,
} from '@app/contracts';

import { TaskService } from './task.service';
import { Observable } from 'rxjs/internal/Observable';

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
}
