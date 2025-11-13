import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UpdatePasswordDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@aled/shared';
import { User } from '@prisma/client';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Создание пользователя (только админы)' })
  @ApiResponse({ status: 201, description: 'Пользователь создан' })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return { data: user };
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Получение списка пользователей' })
  @ApiResponse({ status: 200, description: 'Список пользователей' })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('role') role?: UserRole,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where: any = {};
    
    if (role) where.role = role;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const result = await this.usersService.findMany({
      skip,
      take,
      where,
      orderBy: { createdAt: 'desc' },
    });

    return {
      data: result.users,
      meta: {
        page: result.page,
        limit: take,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }

  @Get('profile')
  @ApiOperation({ summary: 'Получение профиля текущего пользователя' })
  @ApiResponse({ status: 200, description: 'Профиль пользователя' })
  async getProfile(@CurrentUser() user: User) {
    const profile = await this.usersService.getProfile(user.id);
    return { data: profile };
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Получение пользователя по ID' })
  @ApiResponse({ status: 200, description: 'Данные пользователя' })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.getProfile(id);
    return { data: user };
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Обновление собственного профиля' })
  @ApiResponse({ status: 200, description: 'Профиль обновлен' })
  async updateProfile(@CurrentUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    // Пользователи не могут менять свою роль и статус
    const { role, status, ...allowedFields } = updateUserDto;
    const updatedUser = await this.usersService.update(user.id, allowedFields);
    return { data: updatedUser };
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Обновление пользователя (только админы)' })
  @ApiResponse({ status: 200, description: 'Пользователь обновлен' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(id, updateUserDto);
    return { data: user };
  }

  @Patch('profile/password')
  @ApiOperation({ summary: 'Изменение пароля' })
  @ApiResponse({ status: 200, description: 'Пароль изменен' })
  async updatePassword(@CurrentUser() user: User, @Body() updatePasswordDto: UpdatePasswordDto) {
    const result = await this.usersService.updatePassword(user.id, updatePasswordDto);
    return { data: result };
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Удаление пользователя (только супер-админ)' })
  @ApiResponse({ status: 200, description: 'Пользователь удален' })
  async remove(@Param('id') id: string) {
    const result = await this.usersService.remove(id);
    return { data: result };
  }
}
