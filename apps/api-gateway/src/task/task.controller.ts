import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTaskRequestDto } from './dto/create-task-request.dto';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('hello')
  async helloWorld(): Promise<string> {
    return 'Hello World';
  }

  @Post()
  create(@Body() dto: CreateTaskRequestDto) {
    return this.taskService.create(dto);
  }
}
