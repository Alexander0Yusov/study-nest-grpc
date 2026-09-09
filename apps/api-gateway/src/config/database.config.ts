import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  type: 'postgres' as const,
  host: process.env.GATEWAY_DB_HOST,
  port: Number(process.env.GATEWAY_DB_PORT),
  username: process.env.GATEWAY_DB_USERNAME,
  password: process.env.GATEWAY_DB_PASSWORD,
  name: process.env.GATEWAY_DB_NAME,
  synchronize: process.env.GATEWAY_DB_SYNCHRONIZE === 'true',
  logging: process.env.GATEWAY_DB_LOGGING === 'true',
}));
