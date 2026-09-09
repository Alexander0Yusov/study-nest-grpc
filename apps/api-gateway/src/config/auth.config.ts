import { registerAs } from '@nestjs/config';

const DEFAULT_BCRYPT_ROUNDS = 10;
const DEFAULT_ACCESS_TOKEN_TTL_SECONDS = 900;
const DEFAULT_REFRESH_TOKEN_TTL_SECONDS = 604_800;
const DEFAULT_REFRESH_COOKIE_NAME = 'refreshToken';
const DEFAULT_REFRESH_COOKIE_PATH = '/auth';

export type CookieSameSite = 'lax' | 'strict' | 'none';

function parseBcryptRounds(value: string | undefined): number {
  if (value === undefined || value === '') {
    return DEFAULT_BCRYPT_ROUNDS;
  }

  const rounds = Number(value);

  if (!Number.isInteger(rounds) || rounds < 4 || rounds > 31) {
    throw new Error('Invalid GATEWAY_AUTH_BCRYPT_ROUNDS');
  }

  return rounds;
}

function parsePositiveInteger(
  name: string,
  value: string | undefined,
  fallback: number,
): number {
  if (value === undefined || value === '') {
    return fallback;
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new Error(`Invalid ${name}`);
  }

  return parsedValue;
}

function parseRequiredSecret(name: string, value: string | undefined): string {
  const secret = value?.trim();

  if (!secret) {
    throw new Error(`Missing ${name}`);
  }

  return secret;
}

function parseCookieSameSite(value: string | undefined): CookieSameSite {
  if (value === undefined || value === '') {
    return 'lax';
  }

  if (value === 'lax' || value === 'strict' || value === 'none') {
    return value;
  }

  throw new Error('Invalid GATEWAY_AUTH_COOKIE_SAME_SITE');
}

export const authConfig = registerAs('auth', () => {
  const accessTokenSecret = parseRequiredSecret(
    'GATEWAY_AUTH_ACCESS_TOKEN_SECRET',
    process.env.GATEWAY_AUTH_ACCESS_TOKEN_SECRET,
  );

  const refreshTokenSecret = parseRequiredSecret(
    'GATEWAY_AUTH_REFRESH_TOKEN_SECRET',
    process.env.GATEWAY_AUTH_REFRESH_TOKEN_SECRET,
  );

  if (accessTokenSecret === refreshTokenSecret) {
    throw new Error('JWT access and refresh secrets must differ');
  }

  return {
    bcryptRounds: parseBcryptRounds(process.env.GATEWAY_AUTH_BCRYPT_ROUNDS),
    accessTokenSecret,
    refreshTokenSecret,

    accessTokenTtlSeconds: parsePositiveInteger(
      'GATEWAY_AUTH_ACCESS_TOKEN_TTL_SECONDS',
      process.env.GATEWAY_AUTH_ACCESS_TOKEN_TTL_SECONDS,
      DEFAULT_ACCESS_TOKEN_TTL_SECONDS,
    ),

    refreshTokenTtlSeconds: parsePositiveInteger(
      'GATEWAY_AUTH_REFRESH_TOKEN_TTL_SECONDS',
      process.env.GATEWAY_AUTH_REFRESH_TOKEN_TTL_SECONDS,
      DEFAULT_REFRESH_TOKEN_TTL_SECONDS,
    ),

    refreshCookieName:
      process.env.GATEWAY_AUTH_REFRESH_COOKIE_NAME ??
      DEFAULT_REFRESH_COOKIE_NAME,

    refreshCookiePath:
      process.env.GATEWAY_AUTH_REFRESH_COOKIE_PATH ??
      DEFAULT_REFRESH_COOKIE_PATH,

    cookieSecure: process.env.GATEWAY_AUTH_COOKIE_SECURE === 'true',

    cookieSameSite: parseCookieSameSite(
      process.env.GATEWAY_AUTH_COOKIE_SAME_SITE,
    ),
  };
});
