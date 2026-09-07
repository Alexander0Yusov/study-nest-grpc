const {
  existsSync,
  mkdirSync,
  readdirSync,
  renameSync,
  rmSync,
} = require('node:fs');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');

const protoSourceDirectory = path.join(
  projectRoot,
  'libs',
  'contracts',
  'src',
  'proto',
);

const generatedDirectory = path.join(
  projectRoot,
  'libs',
  'contracts',
  'src',
  'generated',
);

const temporaryDirectory = `${generatedDirectory}.temporary-${process.pid}`;
const backupDirectory = `${generatedDirectory}.backup-${process.pid}`;

const isWindows = process.platform === 'win32';

function findExecutable(command) {
  const locator = isWindows ? 'where.exe' : 'which';

  const result = spawnSync(locator, [command], {
    encoding: 'utf8',
  });

  if (result.status !== 0 || !result.stdout.trim()) {
    throw new Error(
      `"${command}" was not found. Install it and add it to PATH.`,
    );
  }

  return result.stdout.trim().split(/\r?\n/)[0];
}

function findProtobufIncludeDirectory(protocPath) {
  const protocRoot = path.dirname(path.dirname(protocPath));

  const candidates = [
    process.env.PROTOC_INCLUDE,
    path.join(protocRoot, 'include'),
    '/usr/local/include',
    '/usr/include',
    '/opt/homebrew/include',
  ].filter(Boolean);

  const includeDirectory = candidates.find((candidate) =>
    existsSync(path.join(candidate, 'google', 'protobuf', 'timestamp.proto')),
  );

  if (!includeDirectory) {
    throw new Error(
      'Cannot find google/protobuf/timestamp.proto. ' +
        'Set the PROTOC_INCLUDE environment variable.',
    );
  }

  return includeDirectory;
}

function findProtoFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return findProtoFiles(entryPath);
    }

    return entry.isFile() && entry.name.endsWith('.proto') ? [entryPath] : [];
  });
}

function replaceGeneratedDirectory() {
  rmSync(backupDirectory, {
    recursive: true,
    force: true,
  });

  const hasPreviousGeneration = existsSync(generatedDirectory);

  if (hasPreviousGeneration) {
    renameSync(generatedDirectory, backupDirectory);
  }

  try {
    renameSync(temporaryDirectory, generatedDirectory);
  } catch (error) {
    if (hasPreviousGeneration && existsSync(backupDirectory)) {
      renameSync(backupDirectory, generatedDirectory);
    }

    throw error;
  }

  rmSync(backupDirectory, {
    recursive: true,
    force: true,
  });
}

function generateProto() {
  if (!existsSync(protoSourceDirectory)) {
    throw new Error(
      `Proto source directory not found: ${protoSourceDirectory}`,
    );
  }

  const protocPath = findExecutable('protoc');
  const protobufIncludeDirectory = findProtobufIncludeDirectory(protocPath);

  const pluginPath = path.join(
    projectRoot,
    'node_modules',
    '.bin',
    isWindows ? 'protoc-gen-ts_proto.cmd' : 'protoc-gen-ts_proto',
  );

  if (!existsSync(pluginPath)) {
    throw new Error('ts-proto plugin was not found. Run "pnpm install" first.');
  }

  const protoFiles = findProtoFiles(protoSourceDirectory);

  if (protoFiles.length === 0) {
    throw new Error(`No .proto files found in ${protoSourceDirectory}`);
  }

  const protoInputs = protoFiles
    .map((file) => path.relative(protoSourceDirectory, file))
    .map((file) => file.split(path.sep).join('/'))
    .sort();

  rmSync(temporaryDirectory, {
    recursive: true,
    force: true,
  });

  mkdirSync(temporaryDirectory, {
    recursive: true,
  });

  const versionResult = spawnSync(protocPath, ['--version'], {
    encoding: 'utf8',
  });

  if (versionResult.status !== 0) {
    throw new Error('protoc exists but cannot be executed.');
  }

  console.log(`[proto:generate] ${versionResult.stdout.trim()}`);
  console.log(`[proto:generate] Found ${protoInputs.length} proto file(s).`);

  const result = spawnSync(
    protocPath,
    [
      `--proto_path=${protoSourceDirectory}`,
      `--proto_path=${protobufIncludeDirectory}`,
      `--plugin=protoc-gen-ts_proto=${pluginPath}`,
      `--ts_proto_out=${temporaryDirectory}`,
      '--ts_proto_opt=nestJs=true,fileSuffix=.pb,addGrpcMetadata=true,useOptionals=all',
      ...protoInputs,
    ],
    {
      cwd: protoSourceDirectory,
      stdio: 'inherit',
    },
  );

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`protoc finished with exit code ${result.status}.`);
  }

  replaceGeneratedDirectory();

  const generatedFiles = findProtoFiles(generatedDirectory)
    .concat(
      readdirSync(generatedDirectory, {
        recursive: true,
        withFileTypes: true,
      })
        .filter((entry) => entry.isFile() && entry.name.endsWith('.ts'))
        .map((entry) => path.join(entry.parentPath, entry.name)),
    )
    .filter((file) => file.endsWith('.ts'))
    .map((file) => path.relative(projectRoot, file))
    .sort();

  console.log('[proto:generate] Generated files:');

  for (const generatedFile of generatedFiles) {
    console.log(`- ${generatedFile}`);
  }
}

try {
  generateProto();
} catch (error) {
  rmSync(temporaryDirectory, {
    recursive: true,
    force: true,
  });

  const message = error instanceof Error ? error.message : String(error);

  console.error(`[proto:generate] Failed: ${message}`);
  process.exitCode = 1;
}
