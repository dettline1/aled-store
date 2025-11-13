import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Доставка и оплата | ALed Store',
  description: 'Условия доставки и способы оплаты в ALed Store',
};

export default function DeliveryPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Доставка и оплата</h1>
      
      <div className="prose max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">🚚 Доставка</h2>
          
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-xl font-semibold mb-3">По Москве и МО</h3>
            <ul className="space-y-2">
              <li>• <strong>Курьером</strong> - от 300₽ (бесплатно от 5000₽)</li>
              <li>• <strong>Срок доставки</strong> - 1-2 дня</li>
              <li>• <strong>Время</strong> - с 10:00 до 21:00</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-xl font-semibold mb-3">По России</h3>
            <ul className="space-y-2">
              <li>• <strong>СДЭК</strong> - от 350₽</li>
              <li>• <strong>Почта России</strong> - от 300₽</li>
              <li>• <strong>Срок доставки</strong> - 3-7 дней</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-3">Самовывоз</h3>
            <p className="mb-2">📍 Москва, ул. Примерная, д. 1</p>
            <p className="text-gray-600">Пн-Пт: 10:00-20:00, Сб-Вс: 11:00-18:00</p>
            <p className="mt-2 font-semibold text-green-600">БЕСПЛАТНО</p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">💳 Оплата</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-3">Онлайн</h3>
              <ul className="space-y-2">
                <li>✅ Банковской картой</li>
                <li>✅ СБП (Система быстрых платежей)</li>
                <li>✅ Электронные кошельки</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-3">При получении</h3>
              <ul className="space-y-2">
                <li>✅ Наличными курьеру</li>
                <li>✅ Картой курьеру</li>
                <li>✅ При самовывозе</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">📞 Остались вопросы?</h2>
          <p className="mb-4">Свяжитесь с нами любым удобным способом:</p>
          <ul className="space-y-2">
            <li>📱 <strong>Телефон:</strong> +7 (999) 123-45-67</li>
            <li>✉️ <strong>Email:</strong> info@aled-store.ru</li>
            <li>💬 <strong>Telegram:</strong> @aled_store</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

