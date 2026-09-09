import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { authConfig } from '../../../config/auth.config';

@Injectable()
export class PasswordHasherService {
  constructor(
    @Inject(authConfig.KEY)
    private readonly config: ConfigType<typeof authConfig>,
  ) {}

  public hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.config.bcryptRounds);
  }

  public compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
