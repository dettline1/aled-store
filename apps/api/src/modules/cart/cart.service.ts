import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateCart(userId?: string, sessionId?: string) {
    let cart = await this.prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId },
      include: {
        items: {
          include: {
            product: { include: { images: true } },
            variant: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: {
          userId,
          sessionId,
          subtotal: 0,
          total: 0,
        },
        include: {
          items: {
            include: {
              product: { include: { images: true } },
              variant: true,
            },
          },
        },
      });
    }

    return cart;
  }

  async addItem(cartId: string, productId: string, qty: number, variantId?: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Товар не найден');

    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId_variantId: {
          cartId,
          productId,
          variantId: variantId || null,
        },
      },
    });

    if (existingItem) {
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { qty: existingItem.qty + qty },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId,
          productId,
          variantId,
          qty,
          priceAtAdd: product.price,
        },
      });
    }

    await this.recalculateCart(cartId);
    return this.getOrCreateCart(undefined, cartId);
  }

  async updateItem(itemId: string, qty: number) {
    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { qty },
    });

    const item = await this.prisma.cartItem.findUnique({ where: { id: itemId } });
    await this.recalculateCart(item.cartId);
  }

  async removeItem(itemId: string) {
    const item = await this.prisma.cartItem.findUnique({ where: { id: itemId } });
    await this.prisma.cartItem.delete({ where: { id: itemId } });
    await this.recalculateCart(item.cartId);
  }

  private async recalculateCart(cartId: string) {
    const items = await this.prisma.cartItem.findMany({ where: { cartId } });
    
    const subtotal = items.reduce((sum, item) => sum + Number(item.priceAtAdd) * item.qty, 0);
    const total = subtotal; // Здесь можно добавить логику скидок, доставки и т.д.

    await this.prisma.cart.update({
      where: { id: cartId },
      data: { subtotal, total },
    });
  }
}
