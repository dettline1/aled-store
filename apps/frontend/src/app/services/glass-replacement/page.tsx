import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Замена стекол фар | ALed Store',
  description: 'Профессиональная замена стекол автомобильных фар',
};

export default function GlassReplacementPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">🔨 Замена стекол фар</h1>
      
      <div className="prose max-w-none">
        <section className="mb-12">
          <p className="text-lg text-gray-700 mb-6">
            Профессиональная замена стекол фар при повреждениях, трещинах или помутнении. 
            Используем оригинальные и качественные аналоги.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-3">✅ Оригинальные стекла</h3>
              <p className="text-gray-600">Работаем с проверенными поставщиками</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-3">🛡️ Гарантия</h3>
              <p className="text-gray-600">Гарантия на работу и материалы</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Стоимость услуг</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold mb-1">Замена стекла (обычное)</h3>
                <p className="text-sm text-gray-500">Снятие старого стекла, установка нового, герметизация</p>
              </div>
              <div className="text-xl font-bold text-blue-600">От 3000₽</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold mb-1">Замена стекла (с линзой)</h3>
                <p className="text-sm text-gray-500">Сложная конструкция, требует особой аккуратности</p>
              </div>
              <div className="text-xl font-bold text-blue-600">От 4500₽</div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Этапы работы</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl mb-2">1️⃣</div>
              <p className="font-semibold mb-1">Диагностика</p>
              <p className="text-sm text-gray-600">Оценка повреждений</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">2️⃣</div>
              <p className="font-semibold mb-1">Подбор стекла</p>
              <p className="text-sm text-gray-600">Поиск оригинала или аналога</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">3️⃣</div>
              <p className="font-semibold mb-1">Замена</p>
              <p className="text-sm text-gray-600">Снятие старого, установка нового</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">4️⃣</div>
              <p className="font-semibold mb-1">Проверка</p>
              <p className="text-sm text-gray-600">Тестирование и регулировка</p>
            </div>
          </div>
        </section>

        <div className="bg-green-50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">📞 Записаться на замену</h2>
          <p className="mb-4">Бесплатная консультация и расчет стоимости:</p>
          <ul className="space-y-2 mb-6">
            <li>📱 Телефон: +7 (999) 123-45-67</li>
            <li>✉️ Email: info@aled-store.ru</li>
          </ul>
          <Link 
            href="/services"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Все услуги
          </Link>
        </div>
      </div>
    </div>
  );
}

