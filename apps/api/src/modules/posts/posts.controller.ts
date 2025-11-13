import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole, PostStatus } from '@aled/shared';
import { User } from '@prisma/client';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiOperation({ summary: 'Получить опубликованные посты' })
  async findPublished(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
  ) {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const result = await this.postsService.getPublishedPosts({
      skip,
      take,
      search,
    });

    return {
      data: result.posts,
      meta: {
        page: parseInt(page),
        limit: take,
        total: result.total,
        totalPages: Math.ceil(result.total / take),
      },
    };
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER, UserRole.CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить все посты (для админки)' })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('status') status?: PostStatus,
    @Query('search') search?: string,
  ) {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    const result = await this.postsService.findMany({
      skip,
      take,
      where,
      orderBy: { createdAt: 'desc' },
    });

    return {
      data: result.posts,
      meta: {
        page: parseInt(page),
        limit: take,
        total: result.total,
        totalPages: Math.ceil(result.total / take),
      },
    };
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Получить пост по slug' })
  async findOne(@Param('slug') slug: string) {
    const post = await this.postsService.findBySlug(slug);
    return { data: post };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER, UserRole.CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать пост' })
  async create(
    @Body() createPostDto: {
      title: string;
      slug: string;
      excerpt?: string;
      content: string;
      coverKey?: string;
      status?: PostStatus;
    },
    @CurrentUser() user: User,
  ) {
    const post = await this.postsService.create({
      ...createPostDto,
      authorId: user.id,
    });
    return { data: post };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER, UserRole.CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить пост' })
  async update(@Param('id') id: string, @Body() updatePostDto: any) {
    const post = await this.postsService.update(id, updatePostDto);
    return { data: post };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER, UserRole.CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить пост' })
  async remove(@Param('id') id: string) {
    await this.postsService.delete(id);
    return { data: { message: 'Пост удален' } };
  }
}
