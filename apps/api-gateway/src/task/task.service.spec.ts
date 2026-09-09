import { ClientGrpc } from '@nestjs/microservices';
import { Observable, of, throwError } from 'rxjs';

import { GetTasksPageResponse, TaskStatus } from '@app/contracts';

import { TaskService } from './task.service';

class GrpcClientStub implements ClientGrpc {
  constructor(private readonly service: unknown) {}

  getService<T extends {}>(_name: string): T {
    return this.service as T;
  }

  getClientByServiceName<T = unknown>(_name: string): T {
    return this.service as T;
  }
}

describe('TaskService.getTasksPage', () => {
  function createService(response$: Observable<GetTasksPageResponse>) {
    const client = {
      getTasksPage: jest.fn(() => response$),
    };
    const service = new TaskService(new GrpcClientStub(client));

    service.onModuleInit();

    return service;
  }

  it('returns an empty page when the gRPC loader omits an empty repeated field', async () => {
    const service = createService(
      of({
        pageNumber: 1,
        pageSize: 20,
        totalCount: 0,
        totalPages: 0,
      }),
    );

    await expect(service.getTasksPage(1, 20, 1)).resolves.toEqual({
      items: [],
      pageNumber: 1,
      pageSize: 20,
      totalCount: 0,
      totalPages: 0,
    });
  });

  it('preserves a non-empty page and its pagination metadata', async () => {
    const service = createService(
      of({
        items: [
          {
            taskId: 1,
            title: 'Task',
            status: TaskStatus.TASK_STATUS_PENDING,
            createdAt: { seconds: 0, nanos: 0 },
            updatedAt: { seconds: 0, nanos: 0 },
          },
        ],
        pageNumber: 2,
        pageSize: 1,
        totalCount: 2,
        totalPages: 2,
      }),
    );

    await expect(service.getTasksPage(2, 1, 1)).resolves.toMatchObject({
      items: [expect.objectContaining({ id: 1, title: 'Task' })],
      pageNumber: 2,
      pageSize: 1,
      totalCount: 2,
      totalPages: 2,
    });
  });

  it('propagates a gRPC error instead of converting it to an empty page', async () => {
    const transportError = new Error('Task service unavailable');
    const client = {
      getTasksPage: jest.fn(() => throwError(() => transportError)),
    };
    const service = new TaskService(new GrpcClientStub(client));

    service.onModuleInit();

    await expect(service.getTasksPage(1, 20, 1)).rejects.toBe(transportError);
  });

  it('returns an empty out-of-range page while preserving the total count', async () => {
    const service = createService(
      of({
        pageNumber: 3,
        pageSize: 2,
        totalCount: 3,
        totalPages: 2,
      }),
    );

    await expect(service.getTasksPage(3, 2, 1)).resolves.toEqual({
      items: [],
      pageNumber: 3,
      pageSize: 2,
      totalCount: 3,
      totalPages: 2,
    });
  });
});
