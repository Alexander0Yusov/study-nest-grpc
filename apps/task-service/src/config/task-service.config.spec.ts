import { loadTaskServiceConfig } from './task-service.config';

describe('loadTaskServiceConfig', () => {
  it('uses a process environment value when it is present', () => {
    expect(
      loadTaskServiceConfig({
        TASK_SERVICE_GRPC_URL: '127.0.0.1:55001',
      }),
    ).toEqual({ grpcUrl: '127.0.0.1:55001' });
  });

  it('uses an application env value after it has been loaded', () => {
    expect(
      loadTaskServiceConfig({
        TASK_SERVICE_GRPC_URL: '127.0.0.1:55002',
      }),
    ).toEqual({ grpcUrl: '127.0.0.1:55002' });
  });

  it('uses the default when neither source defines a gRPC URL', () => {
    expect(loadTaskServiceConfig({})).toEqual({
      grpcUrl: '0.0.0.0:50051',
    });
  });
});
