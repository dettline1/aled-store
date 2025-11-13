import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

// Modules
import { DatabaseModule } from './modules/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CartModule } from './modules/cart/cart.module';
import { OrdersModule } from './modules/orders/orders.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { MediaModule } from './modules/media/media.module';
import { PostsModule } from './modules/posts/posts.module';
import { SettingsModule } from './modules/settings/settings.module';
import { HealthModule } from './modules/health/health.module';
import { AuditModule } from './modules/audit/audit.module';

@Module({
  imports: [
    // Конфигурация
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        ttl: parseInt(process.env.RATE_LIMIT_TTL || '900'),
        limit: parseInt(process.env.RATE_LIMIT_MAX || '1000'),
      }),
    }),

    // Cache (Redis)
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => ({
        store: redisStore,
        url: process.env.REDIS_URL,
        ttl: parseInt(process.env.REDIS_TTL || '3600'),
      }),
    }),

    // Database
    DatabaseModule,

    // Audit logging
    AuditModule,

    // Business modules
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    CartModule,
    OrdersModule,
    CouponsModule,
    ReviewsModule,
    MediaModule,
    PostsModule,
    SettingsModule,
    HealthModule,
  ],
})
export class AppModule {}
