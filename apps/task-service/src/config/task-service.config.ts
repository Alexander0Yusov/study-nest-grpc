const DEFAULT_GRPC_URL = '0.0.0.0:50051';

export interface TaskServiceConfig {
  readonly grpcUrl: string;
}

export function loadTaskServiceConfig(): TaskServiceConfig {
  const grpcUrl = process.env.TASK_SERVICE_GRPC_URL?.trim() || DEFAULT_GRPC_URL;

  const separatorIndex = grpcUrl.lastIndexOf(':');
  const host = grpcUrl.slice(0, separatorIndex);
  const portText = grpcUrl.slice(separatorIndex + 1);

  if (separatorIndex <= 0 || !host || !/^\d+$/.test(portText)) {
    throw new Error(
      `Invalid TASK_SERVICE_GRPC_URL: ${grpcUrl}. Expected host:port.`,
    );
  }

  const port = Number(portText);

  if (port < 1 || port > 65535) {
    throw new Error(`Invalid TASK_SERVICE_GRPC_URL port: ${portText}.`);
  }

  return {
    grpcUrl,
  };
}
