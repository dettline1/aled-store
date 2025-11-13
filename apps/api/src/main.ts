import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Безопасность
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGIN')?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });

  // Глобальные пайпы валидации
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API префикс
  app.setGlobalPrefix('api/v1');

  // Swagger документация
  const config = new DocumentBuilder()
    .setTitle('ALed Store API')
    .setDescription('API для интернет-магазина светодиодной продукции ALed')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Аутентификация и авторизация')
    .addTag('users', 'Пользователи')
    .addTag('products', 'Товары')
    .addTag('categories', 'Категории')
    .addTag('cart', 'Корзина')
    .addTag('orders', 'Заказы')
    .addTag('coupons', 'Купоны')
    .addTag('reviews', 'Отзывы')
    .addTag('media', 'Медиафайлы')
    .addTag('posts', 'Блог')
    .addTag('settings', 'Настройки')
    .addTag('health', 'Проверка состояния')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = configService.get('PORT', 4000);
  await app.listen(port);

  console.log(`🚀 ALed API запущен на http://localhost:${port}`);
  console.log(`📚 Swagger документация: http://localhost:${port}/docs`);
}
