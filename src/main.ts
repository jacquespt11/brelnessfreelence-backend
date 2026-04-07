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
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    transform: true,
    exceptionFactory: (errors) => {
      console.error('[Validation Failed]', JSON.stringify(errors, null, 2));
      return new require('@nestjs/common').BadRequestException(errors);
    }
  }));

  // CORS (for subdomain frontend access)
  app.enableCors({
    origin: (origin, callback) => {
      // Autoriser les requêtes sans origin (ex: mobile apps, Postman)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        // Vercel deployments
        /\.vercel\.app$/,
        // Brelness domain (tous les sous-domaines)
        /\.brelness\.com$/,
        'https://brelness.com',
        'https://www.brelness.com',
        // Développement local
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:3001',
      ];

      const isAllowed = allowedOrigins.some(pattern =>
        pattern instanceof RegExp ? pattern.test(origin) : pattern === origin
      );

      callback(null, isAllowed);
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
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
