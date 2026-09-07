const { cpSync, existsSync, mkdirSync, rmSync } = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');

const sourceDirectory = path.join(
  projectRoot,
  'libs',
  'contracts',
  'src',
  'proto',
);

const destinationDirectory = path.join(
  projectRoot,
  'dist',
  'apps',
  'task-service',
  'proto',
);

if (!existsSync(sourceDirectory)) {
  throw new Error(`Proto source directory not found: ${sourceDirectory}`);
}

rmSync(destinationDirectory, {
  recursive: true,
  force: true,
});

mkdirSync(path.dirname(destinationDirectory), {
  recursive: true,
});

cpSync(sourceDirectory, destinationDirectory, {
  recursive: true,
});

console.log(
  `[task-service:assets] Proto files copied to ${destinationDirectory}`,
);
