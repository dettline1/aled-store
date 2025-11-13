import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as argon2 from 'argon2';

import { PrismaService } from '../database/prisma.service';
import { CreateUserDto, UpdateUserDto, UpdatePasswordDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        select: {
          id: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          firstName: true,
          lastName: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users,
      total,
      page: Math.floor((skip || 0) / (take || 10)) + 1,
      totalPages: Math.ceil(total / (take || 10)),
    };
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('Пользователь с таким email уже существует');
    }

    const passwordHash = await argon2.hash(createUserDto.password);

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        firstName: true,
        lastName: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findById(id); // Проверяем существование

    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        firstName: true,
        lastName: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.findById(id);

    // Проверяем старый пароль
    const isValidPassword = await argon2.verify(user.passwordHash, updatePasswordDto.currentPassword);
    if (!isValidPassword) {
      throw new BadRequestException('Неверный текущий пароль');
    }

    // Хешируем новый пароль
    const passwordHash = await argon2.hash(updatePasswordDto.newPassword);

    await this.prisma.user.update({
      where: { id },
      data: { passwordHash },
    });

    return { message: 'Пароль успешно обновлен' };
  }

  async remove(id: string) {
    await this.findById(id); // Проверяем существование

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'Пользователь успешно удален' };
  }

  async getProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        firstName: true,
        lastName: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            orders: true,
            reviews: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }
}
