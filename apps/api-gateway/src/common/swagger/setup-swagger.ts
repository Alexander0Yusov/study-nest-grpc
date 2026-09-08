import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SWAGGER_THEME_CSS } from './swagger-theme';
import { SWAGGER_THEME_SCRIPT } from './swagger-theme-script';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Study Tasks API')
    .setDescription(
      'HTTP API exposed by the API Gateway. Each Tasks endpoint documents the gRPC interaction used to reach Task Service.',
    )
    .setVersion('1.0.0')
    .addTag('Tasks')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: 'docs-json',
    customSiteTitle: 'Study Tasks API',
    customCss: SWAGGER_THEME_CSS,
    customJsStr: SWAGGER_THEME_SCRIPT,
  });
}
