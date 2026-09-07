import { Injectable } from '@nestjs/common';
import { CreateTaskRequestDto } from './dto/create-task-request.dto';

@Injectable()
export class TaskService {
  create(dto: CreateTaskRequestDto) {
    return {
      message: 'Request passed validation',
      task: dto,
    };
  }
}
