import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { CreateUserDomainDto } from './dto/create-user-domain.dto';
import { User } from './entities/user.entity';

const POSTGRES_UNIQUE_VIOLATION = '23505';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async create(email: string, passwordHash: string): Promise<User> {
    const dto: CreateUserDomainDto = { email, passwordHash };
    const user = User.create(dto);

    try {
      return await this.userRepository.save(user);
    } catch (error: unknown) {
      if (this.isUniqueViolation(error)) {
        throw new ConflictException('Email is already registered');
      }

      throw error;
    }
  }

  public findByEmailForAuthentication(email: string): Promise<User | null> {
    const normalizedEmail = email.trim().toLowerCase();

    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email: normalizedEmail })
      .getOne();
  }

  private isUniqueViolation(error: unknown): boolean {
    if (!(error instanceof QueryFailedError)) {
      return false;
    }

    const driverError: unknown = error.driverError;

    return (
      typeof driverError === 'object' &&
      driverError !== null &&
      'code' in driverError &&
      driverError.code === POSTGRES_UNIQUE_VIOLATION
    );
  }
}
