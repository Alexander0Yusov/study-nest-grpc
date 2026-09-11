import { ConfigType } from '@nestjs/config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import { databaseConfig } from '../config/database.config';
import { TaskEntity } from '../task/entities/task.entity';
import { InitialTaskSchema1700000000000 } from './migrations/1700000000000-initial-task-schema';

export function createTaskDataSourceOptions(
  config: ConfigType<typeof databaseConfig>,
): PostgresConnectionOptions {
  return {
    type: config.type,
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    database: config.name,
    logging: false,
    synchronize: false,
    entities: [TaskEntity],
    migrations: [InitialTaskSchema1700000000000],
  };
}
