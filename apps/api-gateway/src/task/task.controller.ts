import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { TaskService } from './task.service';
import { UpdateTaskStatusesResponse } from '../../../../libs/contracts/src';

import { toTaskResponseDto } from './mappers/task-http.mapper';

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
import { GetTaskParamsDto } from './dto/get-task-params.dto';
import { GetTasksPageQueryDto } from './dto/get-tasks-page-query.dto';
import { GetTasksPageResponseDto } from './dto/get-tasks-page-response.dto';
import { UpdateTaskStatusesResponseDto } from './dto/update-task-statuses-response.dto';
import { GatewayErrorResponseDto } from '../common/swagger/error-response.dto';
import { BEARER_ACCESS_STRATEGY_NAME } from '../auth/guards/bearer-access/bearer-access.constants';
import { BearerAccessGuard } from '../auth/guards/bearer-access/bearer-access.guard';
import { AuthenticatedPrincipal } from '../auth/types/authenticated-principal';
import { AuthUser } from '../utils/decorators/auth-user.decorator';

const GRPC_STREAMING_TRAINING_NOTICE =
  '<span style="color: #d32f2f; font-weight: 700;">' +
  'УЧЕБНОЕ ПРИМЕЧАНИЕ: внутренняя реализация этого endpoint использует ' +
  'gRPC streaming по инициативе автора проекта исключительно для приобретения ' +
  'практического навыка организации стриминга. Для данной бизнес-задачи ' +
  'потоковая модель не является оптимальным инфраструктурным решением.' +
  '</span>';

@ApiTags('Tasks')
@ApiExtraModels(DeletedTaskResultDto, DeleteTaskErrorResultDto)
@UseGuards(BearerAccessGuard)
@ApiBearerAuth(BEARER_ACCESS_STRATEGY_NAME)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({
    operationId: 'createTask',
    summary: 'Create a task',
    description:
      'Gateway performs one unary CreateTask gRPC request. The Gateway normalizes the protobuf task into the HTTP Task model.',
  })
  @ApiBody({ type: CreateTaskRequestDto })
  @ApiCreatedResponse({ type: CreateTaskResponseDto })
  @ApiBadRequestResponse({ type: GatewayErrorResponseDto })
  @ApiServiceUnavailableResponse({ type: GatewayErrorResponseDto })
  @ApiInternalServerErrorResponse({ type: GatewayErrorResponseDto })
  create(
    @Body() dto: CreateTaskRequestDto,
    @AuthUser() principal: AuthenticatedPrincipal,
  ): Promise<CreateTaskResponseDto> {
    return this.taskService.create(dto, principal.userId);
  }

  @Get('paginated')
  @ApiOperation({
    operationId: 'getTasksPage',
    summary: 'Get a paginated task list using unary gRPC',
  })
  @ApiQuery({
    name: 'pageNumber',
    required: false,
    schema: {
      type: 'integer',
      format: 'int32',
      minimum: 1,
      maximum: 2_147_483_647,
      default: 1,
    },
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    schema: {
      type: 'integer',
      format: 'int32',
      minimum: 1,
      maximum: 100,
      default: 20,
    },
  })
  @ApiOkResponse({ type: GetTasksPageResponseDto })
  @ApiBadRequestResponse({ type: GatewayErrorResponseDto })
  @ApiUnauthorizedResponse({ type: GatewayErrorResponseDto })
  @ApiInternalServerErrorResponse({ type: GatewayErrorResponseDto })
  getTasksPage(
    @Query() query: GetTasksPageQueryDto,
    @AuthUser() principal: AuthenticatedPrincipal,
  ): Promise<GetTasksPageResponseDto> {
    return this.taskService.getTasksPage(
      query.pageNumber,
      query.pageSize,
      principal.userId,
    );
  }

  @Get(':taskId')
  @ApiOperation({
    operationId: 'getTask',
    summary: 'Get a task by ID',
  })
  @ApiParam({
    name: 'taskId',
    schema: {
      type: 'integer',
      format: 'int32',
      minimum: 1,
      maximum: 2_147_483_647,
    },
  })
  @ApiOkResponse({ type: CreateTaskResponseDto })
  @ApiBadRequestResponse({ type: GatewayErrorResponseDto })
  @ApiUnauthorizedResponse({ type: GatewayErrorResponseDto })
  @ApiNotFoundResponse({ type: GatewayErrorResponseDto })
  @ApiServiceUnavailableResponse({ type: GatewayErrorResponseDto })
  @ApiInternalServerErrorResponse({ type: GatewayErrorResponseDto })
  getTask(
    @Param() params: GetTaskParamsDto,
    @AuthUser() principal: AuthenticatedPrincipal,
  ): Promise<CreateTaskResponseDto> {
    return this.taskService.getTask(params.taskId, principal.userId);
  }

  /**
   * Учебное примечание: внутренняя реализация этого HTTP endpoint использует
   * gRPC streaming по инициативе автора проекта исключительно для приобретения
   * практического навыка организации стриминга. Для данной бизнес-задачи
   * потоковая модель не является оптимальным инфраструктурным решением.
   */
  @Get()
  @ApiOperation({
    operationId: 'getTasks',
    summary: 'Get all tasks using gRPC server streaming',
    description: `${GRPC_STREAMING_TRAINING_NOTICE}

Gateway receives a finite server stream and returns all received tasks as one HTTP array. An empty gRPC stream produces 200 with items: [].`,
  })
  @ApiOkResponse({ type: GetTasksResponseDto })
  @ApiServiceUnavailableResponse({ type: GatewayErrorResponseDto })
  @ApiInternalServerErrorResponse({ type: GatewayErrorResponseDto })
  async getTasks(
    @AuthUser() principal: AuthenticatedPrincipal,
  ): Promise<GetTasksResponseDto> {
    const items = await this.taskService.getTasks(principal.userId);

    return { items: items.map(toTaskResponseDto) };
  }

  /**
   * Учебное примечание: внутренняя реализация этого HTTP endpoint использует
   * gRPC streaming по инициативе автора проекта исключительно для приобретения
   * практического навыка организации стриминга. Для данной бизнес-задачи
   * потоковая модель не является оптимальным инфраструктурным решением.
   */
  @Patch('status')
  @ApiOperation({
    operationId: 'updateTaskStatuses',
    summary: 'Update statuses for multiple tasks',
    description: `${GRPC_STREAMING_TRAINING_NOTICE}

Gateway sends one client-stream message per task ID. Task Service performs one bulk database update and returns one summary response.`,
  })
  @ApiBody({ type: UpdateTaskStatusesRequestDto })
  @ApiOkResponse({ type: UpdateTaskStatusesResponseDto })
  @ApiBadRequestResponse({ type: GatewayErrorResponseDto })
  @ApiServiceUnavailableResponse({ type: GatewayErrorResponseDto })
  @ApiInternalServerErrorResponse({ type: GatewayErrorResponseDto })
  updateTaskStatuses(
    @Body() dto: UpdateTaskStatusesRequestDto,
    @AuthUser() principal: AuthenticatedPrincipal,
  ): Promise<UpdateTaskStatusesResponse> {
    return this.taskService.updateTaskStatuses(dto, principal.userId);
  }

  /**
   * Учебное примечание: внутренняя реализация этого HTTP endpoint использует
   * gRPC streaming по инициативе автора проекта исключительно для приобретения
   * практического навыка организации стриминга. Для данной бизнес-задачи
   * потоковая модель не является оптимальным инфраструктурным решением.
   */
  @Delete('batch')
  @ApiOperation({
    operationId: 'deleteTasks',
    summary: 'Delete multiple tasks',
    description: `${GRPC_STREAMING_TRAINING_NOTICE}

Gateway exchanges bidirectional gRPC streams. Each incoming ID produces one deleted task or a per-item error; Gateway collects the finite response stream into an HTTP array.`,
  })
  @ApiBody({ type: DeleteTasksRequestDto })
  @ApiOkResponse({ type: DeleteTasksResponseDto })
  @ApiBadRequestResponse({ type: GatewayErrorResponseDto })
  @ApiServiceUnavailableResponse({ type: GatewayErrorResponseDto })
  @ApiInternalServerErrorResponse({ type: GatewayErrorResponseDto })
  deleteTasks(
    @Body() dto: DeleteTasksRequestDto,
    @AuthUser() principal: AuthenticatedPrincipal,
  ): Promise<DeleteTasksResponseDto> {
    return this.taskService.deleteTasks(dto, principal.userId);
  }
}
