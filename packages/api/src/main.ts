import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';
import { config } from './config';

function findCertFile(filename: string): string {
  // Список можливих шляхів до сертифікатів (в порядку пріоритету)
  const possiblePaths = [
    path.join(__dirname, '../certs', filename), // dist/certs (після збірки)
    path.join(process.cwd(), 'certs', filename), // certs в корені проекту
    path.join(process.cwd(), 'scripts', 'certs', filename), // scripts/certs (старе місце)
  ];

  for (const certPath of possiblePaths) {
    if (fs.existsSync(certPath)) {
      return certPath;
    }
  }

  throw new Error(`Не вдалося знайти файл сертифіката: ${filename}. Шукав в: ${possiblePaths.join(', ')}`);
}

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync(findCertFile('key.pem')),
    cert: fs.readFileSync(findCertFile('cert.pem')),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });
  
  // Enable compression
  app.use(compression());
  
  // Use Winston logger
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  
  // Дозволяємо CORS для локальної мережі
  app.enableCors({
    origin: true, // Дозволяємо всі origin в режимі розробки
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // Set global prefix
  app.setGlobalPrefix('api');
  
  // Додаємо глобальну валідацію
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));
  
  // Swagger configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Worklog API')
    .setDescription('The Worklog API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  
  // Налаштовуємо сервер для прослуховування всіх мережевих інтерфейсів
  await app.listen(config.server.port, '0.0.0.0');
  
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
