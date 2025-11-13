import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@aled/shared';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список товаров' })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '24',
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where: any = { isPublished: true };
    
    if (category) {
      where.category = { slug: category };
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const result = await this.productsService.findMany({
      skip,
      take,
      where,
      orderBy: { createdAt: 'desc' },
    });

    return {
      data: result.products,
      meta: {
        page: parseInt(page),
        limit: take,
        total: result.total,
        totalPages: Math.ceil(result.total / take),
      },
    };
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Получить товар по slug' })
  async findOne(@Param('slug') slug: string) {
    const product = await this.productsService.findBySlug(slug);
    return { data: product };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER, UserRole.CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать товар' })
  async create(@Body() createProductDto: any) {
    const product = await this.productsService.create(createProductDto);
    return { data: product };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER, UserRole.CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить товар' })
  async update(@Param('id') id: string, @Body() updateProductDto: any) {
    const product = await this.productsService.update(id, updateProductDto);
    return { data: product };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить товар' })
  async remove(@Param('id') id: string) {
    await this.productsService.delete(id);
    return { data: { message: 'Товар удален' } };
  }
}
