import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateSessionDomainDto } from './dto/create-session-domain.dto';
import { RotateRefreshTokenInput } from './dto/rotate-refresh-token.input';
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

  public rotateRefreshToken(
    input: RotateRefreshTokenInput,
  ): Promise<Session | null> {
    return this.sessionRepository.manager.transaction(async (manager) => {
      const session = await manager.getRepository(Session).findOne({
        where: { id: input.sessionId },
        lock: { mode: 'pessimistic_write' },
      });

      if (
        !session ||
        session.userId !== input.userId ||
        session.refreshTokenVersion !== input.expectedVersion ||
        !session.isActive(input.refreshedAt) ||
        input.expiresAt <= input.refreshedAt
      ) {
        return null;
      }

      session.refresh(input.expiresAt, input.refreshedAt);

      return manager.getRepository(Session).save(session);
    });
  }
}
