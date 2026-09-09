import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { User } from '../../user/entities/user.entity';
import { BaseDomainEntity } from '../../common/base-domain-entity/base-domain-entity';
import { CreateSessionDomainDto } from '../dto/create-session-domain.dto';

@Entity({ name: 'sessions' })
@Index('IDX_sessions_user_id', ['userId'])
export class Session extends BaseDomainEntity {
  @Column({
    name: 'user_id',
    type: 'integer',
  })
  public userId!: number;

  @ManyToOne(() => User, (user) => user.sessions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  public user!: User;

  @Column({
    name: 'last_active_at',
    type: 'timestamptz',
  })
  public lastActiveAt!: Date;

  @Column({
    name: 'expires_at',
    type: 'timestamptz',
  })
  public expiresAt!: Date;

  @Column({
    name: 'revoked_at',
    type: 'timestamptz',
    nullable: true,
  })
  public revokedAt!: Date | null;

  @Column({
    name: 'refresh_token_version',
    type: 'integer',
    default: 0,
  })
  public refreshTokenVersion!: number;

  public static create(dto: CreateSessionDomainDto): Session {
    if (dto.expiresAt <= dto.lastActiveAt) {
      throw new Error('Session expiration must be after creation time');
    }

    const session = new Session();

    session.userId = dto.userId;
    session.lastActiveAt = dto.lastActiveAt;
    session.expiresAt = dto.expiresAt;
    session.revokedAt = null;
    session.refreshTokenVersion = 0;

    return session;
  }

  public refresh(expiresAt: Date, refreshedAt: Date): void {
    if (expiresAt <= refreshedAt) {
      throw new Error('Session expiration must be after refresh time');
    }

    this.expiresAt = expiresAt;
    this.lastActiveAt = refreshedAt;
    this.refreshTokenVersion += 1;
  }

  public revoke(revokedAt = new Date()): void {
    this.revokedAt ??= revokedAt;
  }

  public isActive(at = new Date()): boolean {
    return this.revokedAt === null && this.expiresAt > at;
  }
}
