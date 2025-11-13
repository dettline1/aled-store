import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@aled/shared';
import { User } from '@prisma/client';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать отзыв' })
  async create(
    @Body() createReviewDto: {
      productId: string;
      rating: number;
      text?: string;
    },
    @CurrentUser() user: User,
  ) {
    const review = await this.reviewsService.create({
      ...createReviewDto,
      userId: user.id,
    });
    return { data: review };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER, UserRole.CONTENT, UserRole.SUPPORT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить список отзывов (для модерации)' })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('approved') approved?: string,
    @Query('productId') productId?: string,
  ) {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where: any = {};
    if (approved !== undefined) {
      where.isApproved = approved === 'true';
    }
    if (productId) {
      where.productId = productId;
    }

    const result = await this.reviewsService.findMany({
      skip,
      take,
      where,
      orderBy: { createdAt: 'desc' },
    });

    return {
      data: result.reviews,
      meta: {
        page: parseInt(page),
        limit: take,
        total: result.total,
        totalPages: Math.ceil(result.total / take),
      },
    };
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Получить отзывы товара' })
  async findByProduct(@Param('productId') productId: string) {
    const reviews = await this.reviewsService.findByProduct(productId);
    return { data: reviews };
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER, UserRole.CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Одобрить/отклонить отзыв' })
  async approve(
    @Param('id') id: string,
    @Body() body: { isApproved: boolean },
  ) {
    const review = await this.reviewsService.approve(id, body.isApproved);
    return { data: review };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER, UserRole.CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить отзыв' })
  async remove(@Param('id') id: string) {
    const result = await this.reviewsService.delete(id);
    return { data: result };
  }
}
