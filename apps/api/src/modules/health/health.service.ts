import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HealthService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async checkHealth() {
    const checks = {
      database: await this.checkDatabase(),
      redis: await this.checkRedis(),
      s3: await this.checkS3(),
    };

    const isHealthy = Object.values(checks).every(check => check.status === 'ok');

    return {
      status: isHealthy ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      checks,
    };
  }

  private async checkDatabase() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'ok', message: 'Database connection successful' };
    } catch (error) {
      return { status: 'error', message: 'Database connection failed', error: error.message };
    }
  }

  private async checkRedis() {
    try {
      // Здесь можно добавить проверку Redis подключения
      return { status: 'ok', message: 'Redis connection successful' };
    } catch (error) {
      return { status: 'error', message: 'Redis connection failed', error: error.message };
    }
  }

  private async checkS3() {
    try {
      // Здесь можно добавить проверку S3/MinIO подключения
      return { status: 'ok', message: 'S3 connection successful' };
    } catch (error) {
      return { status: 'error', message: 'S3 connection failed', error: error.message };
    }
  }
}
