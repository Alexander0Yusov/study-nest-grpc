const { cpSync, existsSync, mkdirSync, rmSync } = require('node:fs');
const { dirname, resolve } = require('node:path');

const allowedApplications = new Set(['api-gateway', 'task-service']);

const applicationName = process.argv[2];

if (!allowedApplications.has(applicationName)) {
  throw new Error(
    `Expected application name: ${[...allowedApplications].join(' or ')}`,
  );
}

const projectRoot = resolve(__dirname, '..');
const sourceDirectory = resolve(
  projectRoot,
  'libs',
  'contracts',
  'src',
  'proto',
);
const targetDirectory = resolve(
  projectRoot,
  'dist',
  'apps',
  applicationName,
  'proto',
);

if (!existsSync(sourceDirectory)) {
  throw new Error(`Proto source directory does not exist: ${sourceDirectory}`);
}

rmSync(targetDirectory, {
  recursive: true,
  force: true,
});

mkdirSync(dirname(targetDirectory), {
  recursive: true,
});

cpSync(sourceDirectory, targetDirectory, {
  recursive: true,
});

console.log(
  `[${applicationName}:assets] Proto files copied to ${targetDirectory}`,
);
