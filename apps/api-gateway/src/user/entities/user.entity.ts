import { Check, Column, Entity, OneToMany } from 'typeorm';

import { BaseDomainEntity } from '../../common/base-domain-entity/base-domain-entity';
import { Session } from '../../session/entities/session.entity';
import { CreateUserDomainDto } from '../dto/create-user-domain.dto';

@Entity({ name: 'users' })
@Check('CHK_users_email_lowercase', '"email" = lower("email")')
export class User extends BaseDomainEntity {
  @Column({
    type: 'varchar',
    length: 320,
    nullable: false,
    unique: true,
  })
  public email!: string;

  @Column({
    name: 'password_hash',
    type: 'varchar',
    length: 255,
    nullable: false,
    select: false,
  })
  public passwordHash!: string;

  @OneToMany(() => Session, (session) => session.user)
  public sessions!: Session[];

  public static create(dto: CreateUserDomainDto): User {
    const user = new User();

    user.email = dto.email.trim().toLowerCase();
    user.passwordHash = dto.passwordHash;

    return user;
  }
}
