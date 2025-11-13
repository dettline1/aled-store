import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole, OrderStatus } from '@aled/shared';
import { User } from '@prisma/client';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Создать заказ' })
  async create(
    @Body() createOrderDto: {
      email: string;
      phone: string;
      shippingAddress: any;
      billingAddress?: any;
      cartId: string;
    },
    @CurrentUser() user?: User,
  ) {
    const order = await this.ordersService.create({
      ...createOrderDto,
      userId: user?.id,
    });
    return { data: order };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER, UserRole.SUPPORT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить список заказов (админ)' })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('status') status?: OrderStatus,
  ) {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where: any = {};
    if (status) where.status = status;

    const result = await this.ordersService.findMany({
      skip,
      take,
      where,
      orderBy: { createdAt: 'desc' },
    });

    return {
      data: result.orders,
      meta: {
        page: parseInt(page),
        limit: take,
        total: result.total,
        totalPages: Math.ceil(result.total / take),
      },
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить заказ по ID' })
  async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    const order = await this.ordersService.findById(id);
    
    // Проверяем права доступа
    if (order.userId !== user.id && !['SUPER_ADMIN', 'MANAGER', 'SUPPORT'].includes(user.role)) {
      throw new Error('Доступ запрещен');
    }

    return { data: order };
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER, UserRole.WAREHOUSE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить статус заказа' })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: OrderStatus },
  ) {
    const order = await this.ordersService.updateStatus(id, body.status);
    return { data: order };
  }
}
