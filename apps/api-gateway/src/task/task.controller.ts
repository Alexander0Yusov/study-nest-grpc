import { Body, Controller, Get, Post, Patch, Delete } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';

import { TaskService } from './task.service';
import { UpdateTaskStatusesResponse } from '../../../../libs/contracts/src';

import { toTaskResponseDto } from './mappers/task-http.mapper';
import { toCreateTaskResponseDto } from './mappers/create-task-response.mapper';

import { CreateTaskRequestDto } from './dto/create-task-request.dto';
import { GetTasksResponseDto } from './dto/task-response.dto';
import { UpdateTaskStatusesRequestDto } from './dto/update-task-statuses-request.dto';
import { DeleteTasksRequestDto } from './dto/delete-tasks-request.dto';
import {
  DeletedTaskResultDto,
  DeleteTaskErrorResultDto,
  DeleteTasksResponseDto,
} from './dto/delete-tasks-response.dto';
import { CreateTaskResponseDto } from './dto/create-task-response.dto';
import { UpdateTaskStatusesResponseDto } from './dto/update-task-statuses-response.dto';
import { GatewayErrorResponseDto } from '../common/swagger/error-response.dto';

@ApiTags('Tasks')
@ApiExtraModels(DeletedTaskResultDto, DeleteTaskErrorResultDto)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({
    operationId: 'createTask',
    summary: 'Create a task',
    description:
      'Gateway performs one unary CreateTask gRPC request. The current response preserves protobuf Timestamp objects (seconds and nanos) inside task.createdAt and task.updatedAt.',
  })
  @ApiBody({ type: CreateTaskRequestDto })
  @ApiCreatedResponse({ type: CreateTaskResponseDto })
  @ApiBadRequestResponse({ type: GatewayErrorResponseDto })
  @ApiServiceUnavailableResponse({ type: GatewayErrorResponseDto })
  @ApiInternalServerErrorResponse({ type: GatewayErrorResponseDto })
  async create(
    @Body() dto: CreateTaskRequestDto,
  ): Promise<CreateTaskResponseDto> {
    return toCreateTaskResponseDto(await this.taskService.create(dto));
  }

  @Get()
  @ApiOperation({
    operationId: 'getTasks',
    summary: 'Get all tasks',
    description:
      'Gateway receives a finite server stream and returns all received tasks as one HTTP array. An empty gRPC stream produces 200 with items: [].',
  })
  @ApiOkResponse({ type: GetTasksResponseDto })
  @ApiServiceUnavailableResponse({ type: GatewayErrorResponseDto })
  @ApiInternalServerErrorResponse({ type: GatewayErrorResponseDto })
  async getTasks(): Promise<GetTasksResponseDto> {
    const items = await this.taskService.getTasks();

    return { items: items.map(toTaskResponseDto) };
  }

  @Patch('status')
  @ApiOperation({
    operationId: 'updateTaskStatuses',
    summary: 'Update statuses for multiple tasks',
    description:
      'Gateway sends one client-stream message per task ID. Task Service performs one bulk database update and returns one summary response.',
  })
  @ApiBody({ type: UpdateTaskStatusesRequestDto })
  @ApiOkResponse({ type: UpdateTaskStatusesResponseDto })
  @ApiBadRequestResponse({ type: GatewayErrorResponseDto })
  @ApiServiceUnavailableResponse({ type: GatewayErrorResponseDto })
  @ApiInternalServerErrorResponse({ type: GatewayErrorResponseDto })
  updateTaskStatuses(
    @Body() dto: UpdateTaskStatusesRequestDto,
  ): Promise<UpdateTaskStatusesResponse> {
    return this.taskService.updateTaskStatuses(dto);
  }

  @Delete('batch')
  @ApiOperation({
    operationId: 'deleteTasks',
    summary: 'Delete multiple tasks',
    description:
      'Gateway exchanges bidirectional gRPC streams. Each incoming ID produces one deleted task or a per-item error; Gateway collects the finite response stream into an HTTP array.',
  })
  @ApiBody({ type: DeleteTasksRequestDto })
  @ApiOkResponse({ type: DeleteTasksResponseDto })
  @ApiBadRequestResponse({ type: GatewayErrorResponseDto })
  @ApiServiceUnavailableResponse({ type: GatewayErrorResponseDto })
  @ApiInternalServerErrorResponse({ type: GatewayErrorResponseDto })
  deleteTasks(
    @Body() dto: DeleteTasksRequestDto,
  ): Promise<DeleteTasksResponseDto> {
    return this.taskService.deleteTasks(dto);
  }
}
