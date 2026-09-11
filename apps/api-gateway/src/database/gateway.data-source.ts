import { ConfigType } from '@nestjs/config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import { databaseConfig } from '../config/database.config';
import { InitialGatewaySchema1700000000000 } from './migrations/1700000000000-initial-gateway-schema';
import { Session } from '../session/entities/session.entity';
import { User } from '../user/entities/user.entity';

export function createGatewayDataSourceOptions(
  config: ConfigType<typeof databaseConfig>,
): PostgresConnectionOptions {
  return {
    type: config.type,
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    database: config.name,
    logging: config.logging,
    synchronize: false,
    entities: [User, Session],
    migrations: [InitialGatewaySchema1700000000000],
  };
}
