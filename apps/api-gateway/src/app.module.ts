import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { authConfig } from './config/auth.config';
import { databaseConfig } from './config/database.config';
import { appConfig } from './config/app.config';
import { createGatewayDataSourceOptions } from './database/gateway.data-source';
import { SessionModule } from './session/session.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/api-gateway/.env',
      load: [appConfig, databaseConfig, authConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(databaseConfig)],
      inject: [databaseConfig.KEY],
      useFactory: (
        config: ConfigType<typeof databaseConfig>,
      ): TypeOrmModuleOptions => ({
        ...createGatewayDataSourceOptions(config),
        migrationsRun: false,
        dropSchema: false,
      }),
    }),
    TaskModule,
    SessionModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
