import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      where: { isVisible: true },
      orderBy: { position: 'asc' },
      include: {
        children: {
          where: { isVisible: true },
          orderBy: { position: 'asc' },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.category.findUnique({
      where: { slug },
      include: {
        children: {
          where: { isVisible: true },
          orderBy: { position: 'asc' },
        },
        parent: true,
      },
    });
  }

  async create(data: any) {
    return this.prisma.category.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.category.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.category.delete({ where: { id } });
  }
}
