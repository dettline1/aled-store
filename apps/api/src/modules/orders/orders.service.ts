import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { OrderStatus } from '@aled/shared';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    userId?: string;
    email: string;
    phone: string;
    shippingAddress: any;
    billingAddress?: any;
    cartId: string;
  }) {
    const cart = await this.prisma.cart.findUnique({
      where: { id: data.cartId },
      include: { items: { include: { product: true, variant: true } } },
    });

    const order = await this.prisma.order.create({
      data: {
        userId: data.userId,
        email: data.email,
        phone: data.phone,
        status: OrderStatus.PENDING,
        subtotal: cart.subtotal,
        total: cart.total,
        shippingAddress: data.shippingAddress,
        billingAddress: data.billingAddress,
        paymentStatus: 'PENDING',
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            variantId: item.variantId,
            qty: item.qty,
            unitPrice: item.priceAtAdd,
          })),
        },
      },
      include: { items: { include: { product: true, variant: true } } },
    });

    // Очищаем корзину
    await this.prisma.cartItem.deleteMany({ where: { cartId: data.cartId } });

    return order;
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
  }) {
    const { skip, take, where, orderBy } = params;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          user: { select: { email: true, firstName: true, lastName: true } },
          items: { include: { product: true } },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return { orders, total };
  }

  async findById(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { email: true, firstName: true, lastName: true } },
        items: { include: { product: true, variant: true } },
      },
    });
  }

  async updateStatus(id: string, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }
}
