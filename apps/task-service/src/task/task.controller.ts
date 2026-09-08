import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import {
  CreateTaskRequest,
  CreateTaskResponse,
  TASK_SERVICE_NAME,
  TaskServiceController as TaskServiceControllerContract,
  TaskServiceControllerMethods,
} from '@app/contracts';

import { TaskService } from './task.service';

@Controller()
@TaskServiceControllerMethods()
export class TaskController implements TaskServiceControllerContract {
  constructor(private readonly taskService: TaskService) {}

  @GrpcMethod(TASK_SERVICE_NAME, 'CreateTask')
  createTask(request: CreateTaskRequest): Promise<CreateTaskResponse> {
    return this.taskService.createTask(request);
  }
}
