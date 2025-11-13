import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    userId: string;
    productId: string;
    rating: number;
    text?: string;
  }) {
    // Проверяем, не оставлял ли пользователь уже отзыв на этот товар
    const existingReview = await this.prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: data.userId,
          productId: data.productId,
        },
      },
    });

    if (existingReview) {
      throw new BadRequestException('Вы уже оставили отзыв на этот товар');
    }

    const review = await this.prisma.review.create({
      data: {
        ...data,
        isApproved: false, // Требует модерации
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Пересчитываем рейтинг товара
    await this.updateProductRating(data.productId);

    return review;
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
  }) {
    const { skip, take, where, orderBy } = params;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          product: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      }),
      this.prisma.review.count({ where }),
    ]);

    return { reviews, total };
  }

  async findByProduct(productId: string, onlyApproved = true) {
    const where: any = { productId };
    if (onlyApproved) {
      where.isApproved = true;
    }

    return this.prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async approve(id: string, isApproved: boolean) {
    const review = await this.prisma.review.update({
      where: { id },
      data: { isApproved },
    });

    // Пересчитываем рейтинг товара
    await this.updateProductRating(review.productId);

    return review;
  }

  async delete(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) {
      throw new NotFoundException('Отзыв не найден');
    }

    await this.prisma.review.delete({ where: { id } });

    // Пересчитываем рейтинг товара
    await this.updateProductRating(review.productId);

    return { message: 'Отзыв удален' };
  }

  private async updateProductRating(productId: string) {
    const approvedReviews = await this.prisma.review.findMany({
      where: {
        productId,
        isApproved: true,
      },
    });

    if (approvedReviews.length === 0) {
      await this.prisma.product.update({
        where: { id: productId },
        data: { rating: 0 },
      });
      return;
    }

    const averageRating = approvedReviews.reduce((sum, review) => sum + review.rating, 0) / approvedReviews.length;

    await this.prisma.product.update({
      where: { id: productId },
      data: { rating: Math.round(averageRating * 100) / 100 },
    });
  }
}
