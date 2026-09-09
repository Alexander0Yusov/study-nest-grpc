import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateSessionDomainDto } from './dto/create-session-domain.dto';
import { Session } from './entities/session.entity';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  public create(
    userId: number,
    lastActiveAt: Date,
    expiresAt: Date,
  ): Promise<Session> {
    const dto: CreateSessionDomainDto = {
      userId,
      lastActiveAt,
      expiresAt,
    };

    return this.sessionRepository.save(Session.create(dto));
  }

  public findById(id: number): Promise<Session | null> {
    return this.sessionRepository.findOneBy({ id });
  }
}
