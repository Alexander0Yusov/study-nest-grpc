import { registerAs } from '@nestjs/config';

const DEFAULT_DATABASE_PORT = 5435;
const DEFAULT_POOL_SIZE = 5;

const parseDatabasePort = (value: string | undefined): number => {
  const port = Number(value ?? DEFAULT_DATABASE_PORT);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid TASK_DB_PORT: ${value}`);
  }

  return port;
};

export const databaseConfig = registerAs('database', () => ({
  type: 'postgres' as const,
  host: process.env.TASK_DB_HOST ?? '127.0.0.1',
  port: parseDatabasePort(process.env.TASK_DB_PORT),
  username: process.env.TASK_DB_USERNAME ?? 'study_tasks',
  password: process.env.TASK_DB_PASSWORD ?? 'study_tasks',
  name: process.env.TASK_DB_NAME ?? 'study_tasks',
  poolSize: DEFAULT_POOL_SIZE,

  // Учебное локальное решение. Не использовать в production.
  synchronize: true,
}));
