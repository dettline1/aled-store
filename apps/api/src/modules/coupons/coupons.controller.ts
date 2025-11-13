import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, CouponType } from '@aled/shared';

@ApiTags('coupons')
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post('apply')
  @ApiOperation({ summary: 'Применить купон' })
  async applyCoupon(@Body() body: { code: string; subtotal: number }) {
    const result = await this.couponsService.applyCoupon(body.code, body.subtotal);
    return { data: result };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать купон' })
  async create(@Body() createCouponDto: {
    code: string;
    type: CouponType;
    value: number;
    minSubtotal?: number;
    startsAt?: Date;
    endsAt?: Date;
    usageLimit?: number;
  }) {
    const coupon = await this.couponsService.create(createCouponDto);
    return { data: coupon };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить список купонов' })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const result = await this.couponsService.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });

    return {
      data: result.coupons,
      meta: {
        page: parseInt(page),
        limit: take,
        total: result.total,
        totalPages: Math.ceil(result.total / take),
      },
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить купон' })
  async update(@Param('id') id: string, @Body() updateCouponDto: any) {
    const coupon = await this.couponsService.update(id, updateCouponDto);
    return { data: coupon };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить купон' })
  async remove(@Param('id') id: string) {
    await this.couponsService.delete(id);
    return { data: { message: 'Купон удален' } };
  }
}
