import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import multipart from '@fastify/multipart';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true, bodyLimit: 30 * 1024 * 1024 })
  );

  await app.register(multipart, { attachFieldsToBody: 'keyValues' });

  // Serve static files from the public folder (uploaded images)
  await app.register(require('@fastify/static'), {
    root: join(process.cwd(), 'public'),
    prefix: '/public/',
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // CORS (for subdomain frontend access)
  app.enableCors({
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Brelness API')
    .setDescription('API SaaS multi-tenant de gestion de boutiques')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
  console.log(`\n🚀 Brelness API is running on: http://localhost:${process.env.PORT ?? 3001}/api`);
  console.log(`📚 Swagger docs: http://localhost:${process.env.PORT ?? 3001}/api/docs\n`);
}
bootstrap();
