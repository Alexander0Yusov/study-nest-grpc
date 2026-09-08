import { Body, Controller, Get, Post, Patch, Delete } from '@nestjs/common';

import { TaskService } from './task.service';
import { UpdateTaskStatusesResponse } from '../../../../libs/contracts/src';

import { toTaskResponseDto } from './mappers/task-http.mapper';

import { CreateTaskRequestDto } from './dto/create-task-request.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { UpdateTaskStatusesRequestDto } from './dto/update-task-statuses-request.dto';
import { DeleteTasksRequestDto } from './dto/delete-tasks-request.dto';
import { DeleteTasksResponseDto } from './dto/delete-tasks-response.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() dto: CreateTaskRequestDto) {
    return this.taskService.create(dto);
  }

  @Get()
  async getTasks(): Promise<{ items: TaskResponseDto[] }> {
    const items = await this.taskService.getTasks();

    return { items: items.map(toTaskResponseDto) };
  }

  @Patch('status')
  updateTaskStatuses(
    @Body() dto: UpdateTaskStatusesRequestDto,
  ): Promise<UpdateTaskStatusesResponse> {
    return this.taskService.updateTaskStatuses(dto);
  }

  @Delete('batch')
  deleteTasks(
    @Body() dto: DeleteTasksRequestDto,
  ): Promise<DeleteTasksResponseDto> {
    return this.taskService.deleteTasks(dto);
  }
}
