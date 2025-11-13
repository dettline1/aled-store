import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { PostStatus } from '@aled/shared';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    coverKey?: string;
    authorId: string;
    status?: PostStatus;
  }) {
    return this.prisma.post.create({
      data: {
        ...data,
        status: data.status || PostStatus.DRAFT,
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
  }) {
    const { skip, take, where, orderBy } = params;

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          author: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.post.count({ where }),
    ]);

    return { posts, total };
  }

  async findBySlug(slug: string, includeUnpublished = false) {
    const where: any = { slug };
    if (!includeUnpublished) {
      where.status = PostStatus.PUBLISHED;
      where.publishedAt = { lte: new Date() };
    }

    const post = await this.prisma.post.findUnique({
      where,
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Пост не найден');
    }

    return post;
  }

  async update(id: string, data: any) {
    // Если публикуем пост, устанавливаем publishedAt
    if (data.status === PostStatus.PUBLISHED && !data.publishedAt) {
      data.publishedAt = new Date();
    }

    return this.prisma.post.update({
      where: { id },
      data,
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    return this.prisma.post.delete({ where: { id } });
  }

  async getPublishedPosts(params: {
    skip?: number;
    take?: number;
    search?: string;
  }) {
    const { skip, take, search } = params;

    const where: any = {
      status: PostStatus.PUBLISHED,
      publishedAt: { lte: new Date() },
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.findMany({
      skip,
      take,
      where,
      orderBy: { publishedAt: 'desc' },
    });
  }
}
