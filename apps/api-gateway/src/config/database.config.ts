import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  type: 'postgres' as const,
  host: process.env.GATEWAY_DB_HOST ?? '127.0.0.1',
  port: Number(process.env.GATEWAY_DB_PORT ?? 5435),
  username: process.env.GATEWAY_DB_USERNAME ?? 'study_tasks',
  password: process.env.GATEWAY_DB_PASSWORD ?? 'study_tasks',
  name: process.env.GATEWAY_DB_NAME ?? 'gateway_db',
  logging: process.env.GATEWAY_DB_LOGGING === 'true',
}));
