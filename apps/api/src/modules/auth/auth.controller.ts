import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto, RegisterDto, RefreshTokenDto } from './dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '@prisma/client';

@ApiTags('auth')
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiResponse({ status: 201, description: 'Пользователь успешно зарегистрирован' })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  async register(@Body() registerDto: RegisterDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.register(registerDto);

    // Устанавливаем refresh token в httpOnly cookie
    response.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    });

    return {
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiResponse({ status: 200, description: 'Успешная авторизация' })
  @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.login(loginDto);

    // Устанавливаем refresh token в httpOnly cookie
    response.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    });

    return {
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Обновление токенов' })
  @ApiResponse({ status: 200, description: 'Токены успешно обновлены' })
  @ApiResponse({ status: 401, description: 'Недействительный refresh token' })
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const refreshToken = request.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token не найден');
    }

    const result = await this.authService.refresh(refreshToken);

    // Устанавливаем новый refresh token в httpOnly cookie
    response.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    });

    return {
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Выход из системы' })
  @ApiResponse({ status: 200, description: 'Успешный выход' })
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const refreshToken = request.cookies?.refreshToken;

    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    // Удаляем refresh token cookie
    response.clearCookie('refreshToken');

    return { data: { message: 'Успешный выход из системы' } };
  }

  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Выход из всех устройств' })
  @ApiResponse({ status: 200, description: 'Успешный выход со всех устройств' })
  async logoutAll(@CurrentUser() user: User, @Res({ passthrough: true }) response: Response) {
    await this.authService.logoutAll(user.id);

    // Удаляем refresh token cookie
    response.clearCookie('refreshToken');

    return { data: { message: 'Успешный выход со всех устройств' } };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение данных текущего пользователя' })
  @ApiResponse({ status: 200, description: 'Данные пользователя' })
  async getProfile(@CurrentUser() user: User) {
    const { passwordHash, ...userData } = user;
    
    return {
      data: userData,
    };
  }
}
