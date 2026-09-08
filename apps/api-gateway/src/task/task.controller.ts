import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTaskRequestDto } from './dto/create-task-request.dto';
import { TaskService } from './task.service';
import { toTaskResponseDto } from './mappers/task-http.mapper';
import { TaskResponseDto } from './dto/task-response.dto';

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
}
