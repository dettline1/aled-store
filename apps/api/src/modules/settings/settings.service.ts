import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async get(key: string) {
    const setting = await this.prisma.settings.findUnique({
      where: { key },
    });
    return setting?.value;
  }

  async getMany(keys?: string[]) {
    const where = keys ? { key: { in: keys } } : {};
    
    const settings = await this.prisma.settings.findMany({
      where,
    });

    return settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
  }

  async set(key: string, value: any) {
    return this.prisma.settings.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  async setMany(settings: Record<string, any>) {
    const operations = Object.entries(settings).map(([key, value]) =>
      this.prisma.settings.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    );

    await Promise.all(operations);
    return this.getMany(Object.keys(settings));
  }

  async delete(key: string) {
    return this.prisma.settings.delete({ where: { key } });
  }

  async getPublicSettings() {
    // Возвращаем только публичные настройки
    const publicKeys = [
      'store.name',
      'store.description',
      'store.currency',
      'store.timezone',
      'store.logo',
      'store.favicon',
      'contact.email',
      'contact.phone',
      'contact.address',
      'social.facebook',
      'social.instagram',
      'social.youtube',
    ];

    return this.getMany(publicKeys);
  }

  async getDefaultSettings() {
    return {
      'store.name': { value: 'ALed Store' },
      'store.description': { value: 'Интернет-магазин светодиодной продукции' },
      'store.currency': { value: 'RUB' },
      'store.timezone': { value: 'Europe/Moscow' },
      'store.logo': { value: '' },
      'store.favicon': { value: '' },
      'contact.email': { value: 'info@aled.local' },
      'contact.phone': { value: '+7 (999) 123-45-67' },
      'contact.address': { value: 'Москва, Россия' },
      'payment.stripe_public_key': { value: '' },
      'payment.yookassa_shop_id': { value: '' },
      'shipping.free_shipping_threshold': { value: 5000 },
      'shipping.default_cost': { value: 500 },
      'social.facebook': { value: '' },
      'social.instagram': { value: '' },
      'social.youtube': { value: '' },
      'seo.meta_title': { value: 'ALed - Светодиодная продукция для автомобилей' },
      'seo.meta_description': { value: 'Широкий ассортимент качественной светодиодной продукции для автомобилей. Би-LED линзы, лампы, модули DRL и многое другое.' },
      'features.reviews_enabled': { value: true },
      'features.wishlist_enabled': { value: true },
      'features.compare_enabled': { value: true },
    };
  }
}
