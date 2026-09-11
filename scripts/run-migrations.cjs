const { spawnSync } = require('node:child_process');
const { existsSync } = require('node:fs');
const { resolve } = require('node:path');

const applicationName = process.argv[2];
const allowedApplications = new Set(['api-gateway', 'task-service']);

if (!allowedApplications.has(applicationName)) {
  throw new Error(
    `Expected application name: ${[...allowedApplications].join(' or ')}`,
  );
}

const entrypoint = resolve(
  __dirname,
  '..',
  'dist',
  'apps',
  applicationName,
  'main.js',
);

if (!existsSync(entrypoint)) {
  throw new Error(`Build output does not exist: ${entrypoint}`);
}

const result = spawnSync(process.execPath, [entrypoint], {
  env: {
    ...process.env,
    RUN_MIGRATIONS_ONLY: 'true',
  },
  stdio: 'inherit',
});

if (result.error) {
  throw result.error;
}

process.exitCode = result.status ?? 1;
