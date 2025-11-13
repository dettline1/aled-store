import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ProductWhereInput;
    orderBy?: Prisma.ProductOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          category: true,
          images: { orderBy: { position: 'asc' } },
          variants: true,
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { products, total };
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { position: 'asc' } },
        variants: true,
        reviews: {
          where: { isApproved: true },
          include: { user: { select: { firstName: true, lastName: true } } },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    return product;
  }

  async create(data: Prisma.ProductCreateInput) {
    return this.prisma.product.create({ data });
  }

  async update(id: string, data: Prisma.ProductUpdateInput) {
    return this.prisma.product.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }
}
