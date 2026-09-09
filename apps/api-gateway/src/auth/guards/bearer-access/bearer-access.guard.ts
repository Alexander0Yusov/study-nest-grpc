import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { BEARER_ACCESS_STRATEGY_NAME } from './bearer-access.constants';

@Injectable()
export class BearerAccessGuard extends AuthGuard(BEARER_ACCESS_STRATEGY_NAME) {}
