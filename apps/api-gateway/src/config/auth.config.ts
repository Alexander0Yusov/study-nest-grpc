import { registerAs } from '@nestjs/config';

const DEFAULT_BCRYPT_ROUNDS = 10;

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

export const authConfig = registerAs('auth', () => ({
  bcryptRounds: parseBcryptRounds(process.env.GATEWAY_AUTH_BCRYPT_ROUNDS),
}));
