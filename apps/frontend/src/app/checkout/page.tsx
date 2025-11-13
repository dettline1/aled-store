import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { CheckoutForm } from '@/components/forms/CheckoutForm';
import { CartSummary } from '@/components/cart/CartSummary';

export const metadata = {
  title: 'Оформление заказа',
  description: 'Заполните данные для оформления заказа.',
};

export default function CheckoutPage() {
  const breadcrumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Корзина', href: '/cart' },
    { label: 'Оформление заказа', href: '/checkout' },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-secondary-900 mb-8">
            Оформление заказа
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout form */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-secondary-200 rounded-lg p-6">
                <CheckoutForm />
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-secondary-50 p-6 rounded-lg sticky top-4">
                <h2 className="text-xl font-semibold text-secondary-900 mb-6">
                  Ваш заказ
                </h2>
                
                <CartSummary showPromoCode={false} />

                {/* Security info */}
                <div className="mt-6 pt-6 border-t border-secondary-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-secondary-900 mb-1">
                        Безопасная оплата
                      </h3>
                      <p className="text-sm text-secondary-600">
                        Ваши данные защищены SSL-сертификатом
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
