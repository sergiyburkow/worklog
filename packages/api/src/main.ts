import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, '../../certs/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '../../certs/cert.pem')),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });
  
  // Enable compression
  app.use(compression());
  
  // Use Winston logger
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  
  // Дозволяємо CORS для локальної мережі
  app.enableCors({
    origin: ['https://localhost:5173', 'http://localhost:5173'], // Дозволяємо обидва протоколи для локального розробки
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
  const config = new DocumentBuilder()
    .setTitle('Worklog API')
    .setDescription('The Worklog API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  // Налаштовуємо сервер для прослуховування всіх мережевих інтерфейсів
  await app.listen(4096, '0.0.0.0');
  
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
