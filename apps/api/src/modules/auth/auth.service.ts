import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';

import { PrismaService } from '../database/prisma.service';
import { UsersService } from '../users/users.service';
import { LoginSchema, RegisterSchema } from '@aled/shared';
import { UserRole } from '@aled/shared';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    
    if (user && await argon2.verify(user.passwordHash, password)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginData: LoginSchema) {
    const user = await this.validateUser(loginData.email, loginData.password);
    
    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Аккаунт заблокирован');
    }

    // Генерируем токены
    const tokens = await this.generateTokens(user.id);

    // Сохраняем refresh token в БД
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      ...tokens,
    };
  }

  async register(registerData: RegisterSchema) {
    // Проверяем, существует ли пользователь
    const existingUser = await this.usersService.findByEmail(registerData.email);
    if (existingUser) {
      throw new BadRequestException('Пользователь с таким email уже существует');
    }

    // Хешируем пароль
    const passwordHash = await argon2.hash(registerData.password);

    // Создаём пользователя
    const user = await this.prisma.user.create({
      data: {
        email: registerData.email,
        passwordHash,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        phone: registerData.phone,
        role: UserRole.CUSTOMER,
        status: 'ACTIVE',
      },
    });

    // Генерируем токены
    const tokens = await this.generateTokens(user.id);

    // Сохраняем refresh token в БД
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      ...tokens,
    };
  }

  async refresh(refreshToken: string) {
    try {
      // Проверяем refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      // Ищем сессию в БД
      const session = await this.prisma.session.findUnique({
        where: { refreshToken },
        include: { user: true },
      });

      if (!session || session.expiresAt < new Date()) {
        throw new UnauthorizedException('Недействительный refresh token');
      }

      // Генерируем новые токены
      const tokens = await this.generateTokens(session.userId);

      // Обновляем refresh token в БД
      await this.prisma.session.update({
        where: { id: session.id },
        data: {
          refreshToken: tokens.refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 дней
        },
      });

      return {
        user: {
          id: session.user.id,
          email: session.user.email,
          role: session.user.role,
          firstName: session.user.firstName,
          lastName: session.user.lastName,
        },
        ...tokens,
      };
    } catch (error) {
      throw new UnauthorizedException('Недействительный refresh token');
    }
  }

  async logout(refreshToken: string) {
    await this.prisma.session.deleteMany({
      where: { refreshToken },
    });
  }

  async logoutAll(userId: string) {
    await this.prisma.session.deleteMany({
      where: { userId },
    });
  }

  private async generateTokens(userId: string) {
    const payload = { sub: userId };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRY', '15m'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRY', '7d'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(userId: string, refreshToken: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 дней

    await this.prisma.session.create({
      data: {
        id: uuidv4(),
        userId,
        refreshToken,
        expiresAt,
      },
    });
  }
}
