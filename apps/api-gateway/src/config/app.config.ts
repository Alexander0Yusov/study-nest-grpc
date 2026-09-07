import { registerAs } from '@nestjs/config';

function parsePort(value: string | undefined, fallback: number): number {
  const port = Number(value ?? fallback);

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error(`Invalid API_GATEWAY_PORT: ${value}`);
  }

  return port;
}

export const appConfig = registerAs('app', () => ({
  host: process.env.API_GATEWAY_HOST ?? '0.0.0.0',
  port: parsePort(process.env.API_GATEWAY_PORT, 3000),
}));
