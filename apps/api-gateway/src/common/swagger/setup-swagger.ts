import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SWAGGER_THEME_CSS } from './swagger-theme';
import { SWAGGER_THEME_SCRIPT } from './swagger-theme-script';
import { BEARER_ACCESS_STRATEGY_NAME } from '../../auth/guards/bearer-access/bearer-access.constants';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Study Tasks API')
    .setDescription(
      'HTTP API exposed by the API Gateway. Each Tasks endpoint documents the gRPC interaction used to reach Task Service.',
    )
    .setVersion('1.0.0')
    .addTag('Auth')
    .addTag('Tasks')
    .addBearerAuth(undefined, BEARER_ACCESS_STRATEGY_NAME)
    .addCookieAuth(
      'refreshToken',
      {
        type: 'apiKey',
        description:
          'Refresh token передаётся через HttpOnly cookie «refreshToken». Получите cookie через POST /auth/login. Не передавайте refresh token в Authorization header или request body.',
      },
      'refresh-token-cookie',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: 'docs-json',
    customSiteTitle: 'Study Tasks API',
    customCss: SWAGGER_THEME_CSS,
    customJsStr: SWAGGER_THEME_SCRIPT,
  });
}
