import { Category } from '@/types';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Би-LED линзы',
    slug: 'bi-led-lenses',
    description: 'Современные светодиодные би-линзы для фар автомобилей',
    image: '/images/categories/bi-led-lenses.jpg',
    productsCount: 5,
  },
  {
    id: '2',
    name: 'Светодиодные лампы',
    slug: 'led-lamps',
    description: 'Светодиодные автомобильные лампы различных серий и цоколей',
    image: '/images/categories/led-lamps.jpg',
    productsCount: 3,
  },
  {
    id: '3',
    name: 'Товары для установки',
    slug: 'installation-products',
    description: 'Герметики и другие товары для профессиональной установки',
    image: '/images/categories/installation-products.jpg',
    productsCount: 2,
  },
];
