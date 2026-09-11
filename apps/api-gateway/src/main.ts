import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import fastifyCookie from '@fastify/cookie';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';
import { setupSwagger } from './common/swagger/setup-swagger';

import { ConfigType } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { appConfig } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  if (process.env.RUN_MIGRATIONS_ONLY === 'true') {
    await app.get(DataSource).runMigrations({ transaction: 'all' });
    await app.close();
    return;
  }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      forbidUnknownValues: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.register(fastifyCookie);

  const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);

  setupSwagger(app);

  await app.listen(config.port, config.host);
}
bootstrap();
