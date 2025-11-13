import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@aled/shared';

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('public')
  @ApiOperation({ summary: 'Получить публичные настройки' })
  async getPublic() {
    const settings = await this.settingsService.getPublicSettings();
    return { data: settings };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить все настройки' })
  async getAll() {
    const settings = await this.settingsService.getMany();
    return { data: settings };
  }

  @Get('defaults')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить настройки по умолчанию' })
  async getDefaults() {
    const defaults = await this.settingsService.getDefaultSettings();
    return { data: defaults };
  }

  @Get(':key')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить настройку по ключу' })
  async getOne(@Param('key') key: string) {
    const value = await this.settingsService.get(key);
    return { data: { key, value } };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить настройки' })
  async updateMany(@Body() body: { settings: Record<string, any> }) {
    const settings = await this.settingsService.setMany(body.settings);
    return { data: settings };
  }

  @Post(':key')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить настройку' })
  async updateOne(
    @Param('key') key: string,
    @Body() body: { value: any },
  ) {
    const setting = await this.settingsService.set(key, body.value);
    return { data: setting };
  }

  @Delete(':key')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить настройку' })
  async remove(@Param('key') key: string) {
    await this.settingsService.delete(key);
    return { data: { message: 'Настройка удалена' } };
  }
}
