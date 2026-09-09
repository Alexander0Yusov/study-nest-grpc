import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { authConfig } from './config/auth.config';
import { databaseConfig } from './config/database.config';
import { appConfig } from './config/app.config';
import { SessionModule } from './session/session.module';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';

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
        type: config.type,
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password,
        database: config.name,
        synchronize: config.synchronize,
        logging: config.logging,
        migrationsRun: false,
        dropSchema: false,
        autoLoadEntities: true,
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
