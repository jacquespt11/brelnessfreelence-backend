"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const multipart_1 = __importDefault(require("@fastify/multipart"));
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_fastify_1.FastifyAdapter({ logger: true, bodyLimit: 30 * 1024 * 1024 }));
    await app.register(multipart_1.default, { attachFieldsToBody: 'keyValues' });
    await app.register(require('@fastify/static'), {
        root: (0, path_1.join)(process.cwd(), 'public'),
        prefix: '/public/',
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        exceptionFactory: (errors) => {
            console.error('[Validation Failed]', JSON.stringify(errors, null, 2));
            return new common_1.BadRequestException(errors);
        }
    }));
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin)
                return callback(null, true);
            const allowedOrigins = [
                /\.vercel\.app$/,
                /\.brelness\.com$/,
                'https://brelness.com',
                'https://www.brelness.com',
                'http://localhost:5173',
                'http://localhost:3000',
                'http://localhost:3001',
            ];
            const isAllowed = allowedOrigins.some(pattern => pattern instanceof RegExp ? pattern.test(origin) : pattern === origin);
            callback(null, isAllowed);
        },
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type,Authorization',
    });
    app.setGlobalPrefix('api');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Brelness API')
        .setDescription('API SaaS multi-tenant de gestion de boutiques')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
    console.log(`\n🚀 Brelness API is running on: http://localhost:${process.env.PORT ?? 3001}/api`);
    console.log(`📚 Swagger docs: http://localhost:${process.env.PORT ?? 3001}/api/docs\n`);
}
bootstrap();
//# sourceMappingURL=main.js.map