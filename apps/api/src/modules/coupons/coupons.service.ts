import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CouponType } from '@aled/shared';

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    code: string;
    type: CouponType;
    value: number;
    minSubtotal?: number;
    startsAt?: Date;
    endsAt?: Date;
    usageLimit?: number;
  }) {
    const existingCoupon = await this.prisma.coupon.findUnique({
      where: { code: data.code },
    });

    if (existingCoupon) {
      throw new BadRequestException('Купон с таким кодом уже существует');
    }

    return this.prisma.coupon.create({ data });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
  }) {
    const { skip, take, where, orderBy } = params;

    const [coupons, total] = await Promise.all([
      this.prisma.coupon.findMany({
        skip,
        take,
        where,
        orderBy,
      }),
      this.prisma.coupon.count({ where }),
    ]);

    return { coupons, total };
  }

  async findByCode(code: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      throw new NotFoundException('Купон не найден');
    }

    return coupon;
  }

  async validateCoupon(code: string, subtotal: number) {
    const coupon = await this.findByCode(code);

    // Проверяем активность по датам
    const now = new Date();
    if (coupon.startsAt && coupon.startsAt > now) {
      throw new BadRequestException('Купон еще не активен');
    }
    if (coupon.endsAt && coupon.endsAt < now) {
      throw new BadRequestException('Купон истек');
    }

    // Проверяем лимит использований
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new BadRequestException('Купон исчерпан');
    }

    // Проверяем минимальную сумму
    if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
      throw new BadRequestException(`Минимальная сумма заказа: ${coupon.minSubtotal} руб.`);
    }

    return coupon;
  }

  async applyCoupon(code: string, subtotal: number) {
    const coupon = await this.validateCoupon(code, subtotal);

    let discountAmount = 0;
    if (coupon.type === CouponType.PERCENT) {
      discountAmount = (subtotal * Number(coupon.value)) / 100;
    } else {
      discountAmount = Number(coupon.value);
    }

    // Скидка не может быть больше суммы заказа
    discountAmount = Math.min(discountAmount, subtotal);

    return {
      coupon,
      discountAmount,
      newTotal: subtotal - discountAmount,
    };
  }

  async useCoupon(couponId: string) {
    await this.prisma.coupon.update({
      where: { id: couponId },
      data: { usedCount: { increment: 1 } },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.coupon.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.coupon.delete({ where: { id } });
  }
}
