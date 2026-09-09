import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { BEARER_REFRESH_STRATEGY_NAME } from './bearer-refresh.constants';

@Injectable()
export class BearerRefreshGuard extends AuthGuard(
  BEARER_REFRESH_STRATEGY_NAME,
) {}
