import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@aled/shared';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Получить дерево категорий' })
  async findAll() {
    const categories = await this.categoriesService.findAll();
    return { data: categories };
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Получить категорию по slug' })
  async findOne(@Param('slug') slug: string) {
    const category = await this.categoriesService.findBySlug(slug);
    return { data: category };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER, UserRole.CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать категорию' })
  async create(@Body() createCategoryDto: any) {
    const category = await this.categoriesService.create(createCategoryDto);
    return { data: category };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER, UserRole.CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить категорию' })
  async update(@Param('id') id: string, @Body() updateCategoryDto: any) {
    const category = await this.categoriesService.update(id, updateCategoryDto);
    return { data: category };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить категорию' })
  async remove(@Param('id') id: string) {
    await this.categoriesService.delete(id);
    return { data: { message: 'Категория удалена' } };
  }
}
