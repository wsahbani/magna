import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  // Enable CORS for frontend communication
  app.enableCors({
    origin: "*", // Vite dev server
    credentials: true,
  });

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('Process Manager API')
    .setDescription('Orange Group Process Management System API Documentation')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('processes', 'Process management')
    .addTag('workspaces', 'Workspace management')
    .addTag('users', 'User management')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Process Manager API',
    customfavIcon: 'https://www.orange.com/favicon.ico',
    customCss: '.swagger-ui .topbar { background-color: #ff6900; }',
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
  
  await app.listen(3001);
  console.log('API server running on http://localhost:3001');
  console.log('Swagger documentation available at http://localhost:3001/api/docs');
}
bootstrap();