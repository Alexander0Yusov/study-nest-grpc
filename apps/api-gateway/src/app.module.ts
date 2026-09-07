import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { appConfig } from './config/app.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    TaskModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
