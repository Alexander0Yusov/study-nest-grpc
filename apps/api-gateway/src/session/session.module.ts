import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Session } from './entities/session.entity';
import { SessionsService } from './session.service';

@Module({
  imports: [TypeOrmModule.forFeature([Session])],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionModule {}
