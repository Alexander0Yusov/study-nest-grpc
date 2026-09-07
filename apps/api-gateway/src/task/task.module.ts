import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { grpcTaskOptions } from '../config/grpc.config';

@Module({
  imports: [ClientsModule.registerAsync([grpcTaskOptions])],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
