import { Controller, Get } from '@nestjs/common';

@Controller('task')
export class TaskController {
  @Get('hello')
  async helloWorld(): Promise<string> {
    return 'Hello World';
  }
}
