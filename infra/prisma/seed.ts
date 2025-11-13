import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Начинаем посев данных...');

  // Создаем администратора
  const adminPassword = await argon2.hash('admin123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@aled.local' },
    update: {},
    create: {
      email: 'admin@aled.local',
      passwordHash: adminPassword,
      firstName: 'Админ',
      lastName: 'ALed',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
  });

  console.log('👤 Создан администратор:', admin.email);

  // Создаем менеджера
  const managerPassword = await argon2.hash('manager123');
  const manager = await prisma.user.upsert({
    where: { email: 'manager@aled.local' },
    update: {},
    create: {
      email: 'manager@aled.local',
      passwordHash: managerPassword,
      firstName: 'Менеджер',
      lastName: 'ALed',
      role: 'MANAGER',
      status: 'ACTIVE',
    },
  });

  console.log('👤 Создан менеджер:', manager.email);

  // Создаем тестового клиента
  const customerPassword = await argon2.hash('customer123');
  const customer = await prisma.user.upsert({
    where: { email: 'customer@aled.local' },
    update: {},
    create: {
      email: 'customer@aled.local',
      passwordHash: customerPassword,
      firstName: 'Тест',
      lastName: 'Клиент',
      role: 'CUSTOMER',
      status: 'ACTIVE',
    },
  });

  console.log('👤 Создан тестовый клиент:', customer.email);

  // Создаем категории
  const rootCategory = await prisma.category.upsert({
    where: { slug: 'led-products' },
    update: {},
    create: {
      name: 'Светодиодная продукция',
      slug: 'led-products',
      description: 'Полный ассортимент светодиодной продукции для автомобилей',
      position: 1,
      isVisible: true,
    },
  });

  const categories = [
    {
      name: 'Би-светодиодные линзы',
      slug: 'bi-led-lenses',
      description: 'Би-светодиодные линзы для фар головного света',
      parentId: rootCategory.id,
      position: 1,
    },
    {
      name: 'LED лампы',
      slug: 'led-lamps',
      description: 'Светодиодные лампы различных типов цоколей',
      parentId: rootCategory.id,
      position: 2,
    },
    {
      name: 'LED ленты',
      slug: 'led-strips',
      description: 'Светодиодные ленты для декоративной подсветки',
      parentId: rootCategory.id,
      position: 3,
    },
    {
      name: 'DRL модули',
      slug: 'drl-modules',
      description: 'Модули дневных ходовых огней',
      parentId: rootCategory.id,
      position: 4,
    },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log('📂 Создано категорий:', categories.length + 1);

  // Создаем атрибуты
  const colorAttribute = await prisma.attribute.upsert({
    where: { slug: 'color' },
    update: {},
    create: {
      name: 'Цвет',
      slug: 'color',
    },
  });

  const colorValues = ['Белый', 'Желтый', 'Синий', 'Красный', 'Зеленый'];
  for (const color of colorValues) {
    await prisma.attributeValue.upsert({
      where: { 
        attributeId_slug: {
          attributeId: colorAttribute.id,
          slug: color.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')
        }
      },
      update: {},
      create: {
        attributeId: colorAttribute.id,
        value: color,
        slug: color.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-'),
      },
    });
  }

  // Создаем товары
  const biLedCategory = await prisma.category.findUnique({ where: { slug: 'bi-led-lenses' } });
  const ledLampsCategory = await prisma.category.findUnique({ where: { slug: 'led-lamps' } });

  const products = [
    {
      name: 'Би-светодиодные линзы ALed X5 Pro',
      slug: 'aled-x5-pro-bi-led',
      sku: 'ALED-X5-PRO-001',
      description: 'Профессиональные би-светодиодные линзы с превосходным качеством света и долговечностью.',
      shortDescription: 'Профессиональные би-LED линзы X5 Pro',
      price: 12500,
      oldPrice: 15000,
      stock: 25,
      isPublished: true,
      rating: 4.8,
      categoryId: biLedCategory?.id,
      brand: 'ALed',
    },
    {
      name: 'LED лампы H7 ALed Premium',
      slug: 'aled-h7-premium-led',
      sku: 'ALED-H7-PREM-001',
      description: 'Премиальные LED лампы H7 с идеальным световым потоком и простой установкой.',
      shortDescription: 'LED лампы H7 Premium series',
      price: 3500,
      stock: 50,
      isPublished: true,
      rating: 4.6,
      categoryId: ledLampsCategory?.id,
      brand: 'ALed',
    },
    {
      name: 'Би-светодиодные линзы ALed M3',
      slug: 'aled-m3-bi-led',
      sku: 'ALED-M3-001',
      description: 'Компактные би-светодиодные линзы для стандартных фар.',
      shortDescription: 'Компактные би-LED линзы M3',
      price: 8500,
      stock: 30,
      isPublished: true,
      rating: 4.5,
      categoryId: biLedCategory?.id,
      brand: 'ALed',
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log('🛍️ Создано товаров:', products.length);

  // Создаем купоны
  const coupons = [
    {
      code: 'WELCOME10',
      type: 'PERCENT' as const,
      value: 10,
      minSubtotal: 5000,
      usageLimit: 100,
    },
    {
      code: 'SAVE500',
      type: 'FIXED' as const,
      value: 500,
      minSubtotal: 10000,
      usageLimit: 50,
    },
    {
      code: 'FREESHIP',
      type: 'FIXED' as const,
      value: 1000,
      minSubtotal: 15000,
      usageLimit: 30,
    },
  ];

  for (const coupon of coupons) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: {},
      create: coupon,
    });
  }

  console.log('🎫 Создано купонов:', coupons.length);

  // Создаем настройки
  const settings = [
    {
      key: 'store.name',
      value: { value: 'ALed Store' },
    },
    {
      key: 'store.description',
      value: { value: 'Интернет-магазин светодиодной продукции для автомобилей' },
    },
    {
      key: 'store.currency',
      value: { value: 'RUB' },
    },
    {
      key: 'store.timezone',
      value: { value: 'Europe/Moscow' },
    },
  ];

  for (const setting of settings) {
    await prisma.settings.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log('⚙️ Создано настроек:', settings.length);

  // Создаем посты блога
  const posts = [
    {
      title: 'Как выбрать правильные би-светодиодные линзы',
      slug: 'how-to-choose-bi-led-lenses',
      excerpt: 'Подробное руководство по выбору би-светодиодных линз для вашего автомобиля.',
      content: `# Как выбрать правильные би-светодиодные линзы

Выбор би-светодиодных линз - важное решение для каждого автовладельца...

## Основные критерии выбора

1. **Размер и совместимость**
2. **Качество света**
3. **Долговечность**
4. **Простота установки**

Наши специалисты помогут вам выбрать идеальные линзы для вашего автомобиля.`,
      authorId: admin.id,
      status: 'PUBLISHED' as const,
      publishedAt: new Date(),
    },
    {
      title: 'Преимущества светодиодного освещения в автомобиле',
      slug: 'led-lighting-advantages',
      excerpt: 'Узнайте о всех преимуществах перехода на светодиодное освещение.',
      content: `# Преимущества светодиодного освещения

LED технологии произвели революцию в автомобильном освещении...`,
      authorId: admin.id,
      status: 'PUBLISHED' as const,
      publishedAt: new Date(),
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }

  console.log('📝 Создано постов блога:', posts.length);

  console.log('✅ Посев данных завершен!');
  console.log('\n🔑 Учетные записи для входа:');
  console.log('Администратор: admin@aled.local / admin123');
  console.log('Менеджер: manager@aled.local / manager123');
  console.log('Клиент: customer@aled.local / customer123');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при посеве данных:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
