import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { Request } from 'express';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({ summary: 'Получить или создать корзину' })
  async getCart(@Req() request: Request, @CurrentUser() user?: User) {
    const sessionId = request.sessionID || 'anonymous';
    const cart = await this.cartService.getOrCreateCart(user?.id, sessionId);
    return { data: cart };
  }

  @Post('items')
  @ApiOperation({ summary: 'Добавить товар в корзину' })
  async addItem(
    @Body() body: { cartId: string; productId: string; qty: number; variantId?: string },
  ) {
    const cart = await this.cartService.addItem(
      body.cartId,
      body.productId,
      body.qty,
      body.variantId,
    );
    return { data: cart };
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Изменить количество товара' })
  async updateItem(@Param('id') id: string, @Body() body: { qty: number }) {
    await this.cartService.updateItem(id, body.qty);
    return { data: { message: 'Количество обновлено' } };
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Удалить товар из корзины' })
  async removeItem(@Param('id') id: string) {
    await this.cartService.removeItem(id);
    return { data: { message: 'Товар удален из корзины' } };
  }
}
