import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { CartList } from '@/components/cart/CartList';
import { CartSummary } from '@/components/cart/CartSummary';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const metadata = {
  title: 'Корзина',
  description: 'Просмотрите товары в корзине и оформите заказ.',
};

export default function CartPage() {
  const breadcrumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Корзина', href: '/cart' },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-secondary-900 mb-8">
            Корзина
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2">
              <CartList />
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-secondary-50 p-6 rounded-lg sticky top-4">
                <h2 className="text-xl font-semibold text-secondary-900 mb-6">
                  Итого по заказу
                </h2>
                
                <CartSummary showPromoCode={true} />
                
                <div className="mt-6 space-y-3">
                  <Button asChild className="w-full" size="lg">
                    <Link href="/checkout">
                      Оформить заказ
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/catalog">
                      Продолжить покупки
                    </Link>
                  </Button>
                </div>

                {/* Additional info */}
                <div className="mt-6 pt-6 border-t border-secondary-200">
                  <h3 className="font-medium text-secondary-900 mb-3">
                    Информация о доставке
                  </h3>
                  <ul className="text-sm text-secondary-600 space-y-2">
                    <li>• Самовывоз из магазина — бесплатно</li>
                    <li>• Курьерская доставка — 300₽</li>
                    <li>• Бесплатная доставка от 3000₽</li>
                    <li>• Доставка по Москве — 1-2 дня</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
