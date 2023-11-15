import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { SanitizePipe } from './utils/pipe/sanitize.pipe';
import { GlobalHTTPExceptionFilter } from './utils/globalFilterHTTP.exception';

//--событие, которое перехватывает необработанные исключения. Затем мы регистрируем ошибку на консоли--//
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalHTTPExceptionFilter());
  app.setGlobalPrefix('dev/api');
  const configService = app.get(ConfigService);
  const port = configService.get('APP_PORT');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
    new SanitizePipe(),
  );
  app.use(helmet());
  if (configService.get('NODE_ENV') === 'dev') {
    app.enableCors();
  } else {
    app.enableCors({
      origin: configService.get('ALLOW_URL'),
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
      credentials: true,
    });
  }
  // Создаем экземпляр билдера Swagger-документации
  const config = new DocumentBuilder()
    .setTitle('API BotKits')
    .setDescription('Ручки для команды frontend')
    .setVersion('1.0')
    .addTag('auth', 'Авторизация пользователей')
    .addTag('accounts', 'Аккаунты пользователей')
    .addTag('profiles', 'Профили пользователей')
    .addTag('bots', 'Боты')
    .addTag('botAccesses', 'Управление доступами к ботам')
    .addTag('platforms', 'Подключаемые платформы')
    .addTag('tariffs', 'Тарифы работы с площадкой')
    .addTag('subscriptions', 'Подписки пользователей на тарифы')
    .addTag('payments', 'Платежи пользователей')
    .addTag('promocodes', 'Промокоды')
    .addTag('notification', 'Уведомления пользователей')
    .addBearerAuth()
    .build(); // завершаем конфигурирование вызовом build

  const document = SwaggerModule.createDocument(app, config);

  // Сохраняем JSON документ в YAML файл
  const yamlDocument = yaml.dump(document);
  fs.writeFileSync('./swagger.yaml', yamlDocument, 'utf8');

  // первый аргумент - путь, по которому будет доступна
  // веб-страница с документацией Swagger
  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(port);
}

bootstrap();
