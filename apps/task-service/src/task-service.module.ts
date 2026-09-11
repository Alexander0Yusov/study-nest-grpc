import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { databaseConfig } from './config/database.config';
import { createTaskDataSourceOptions } from './database/task.data-source';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/task-service/.env',
      load: [databaseConfig],
    }),

    TypeOrmModule.forRootAsync({
      inject: [databaseConfig.KEY],
      useFactory: (config: ConfigType<typeof databaseConfig>) => ({
        ...createTaskDataSourceOptions(config),
        poolSize: config.poolSize,
        migrationsRun: false,
      }),
    }),

    TaskModule,
  ],
})
export class TaskServiceModule {}
