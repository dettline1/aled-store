import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Ремонт фар | ALed Store',
  description: 'Профессиональный ремонт автомобильных фар',
};

export default function RepairPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">🔧 Ремонт фар</h1>
      
      <div className="prose max-w-none">
        <section className="mb-12">
          <p className="text-lg text-gray-700 mb-6">
            Профессиональный ремонт автомобильных фар любой сложности. 
            Восстановление геометрии, замена отражателей, ремонт креплений.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-3">⚡ Быстро</h3>
              <p className="text-gray-600">Ремонт от 1 часа. Возможен срочный ремонт.</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-3">💰 Недорого</h3>
              <p className="text-gray-600">Цены от 1500₽. Гарантия на работы.</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-3">✅ Качественно</h3>
              <p className="text-gray-600">Опытные мастера. Гарантия качества.</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Виды ремонта</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-2">Восстановление отражателя</h3>
              <p className="text-gray-600 mb-2">От 2000₽</p>
              <p className="text-sm text-gray-500">Полировка или замена отражателя</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-2">Ремонт корпуса</h3>
              <p className="text-gray-600 mb-2">От 1500₽</p>
              <p className="text-sm text-gray-500">Устранение трещин, сколов, восстановление креплений</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-2">Герметизация</h3>
              <p className="text-gray-600 mb-2">От 1000₽</p>
              <p className="text-sm text-gray-500">Устранение запотевания фар</p>
            </div>
          </div>
        </section>

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">📞 Записаться на ремонт</h2>
          <p className="mb-4">Свяжитесь с нами для записи:</p>
          <ul className="space-y-2 mb-6">
            <li>📱 Телефон: +7 (999) 123-45-67</li>
            <li>✉️ Email: info@aled-store.ru</li>
          </ul>
          <Link 
            href="/services"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Все услуги
          </Link>
        </div>
      </div>
    </div>
  );
}

