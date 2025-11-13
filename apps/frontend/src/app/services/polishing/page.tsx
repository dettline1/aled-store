import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Полировка фар | ALed Store',
  description: 'Профессиональная полировка автомобильных фар',
};

export default function PolishingPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">✨ Полировка фар</h1>
      
      <div className="prose max-w-none">
        <section className="mb-12">
          <p className="text-lg text-gray-700 mb-6">
            Восстановление прозрачности помутневших фар. Удаление царапин, желтизны и матовости. 
            Фары будут светить как новые!
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-4xl mb-3">💡</div>
              <h3 className="text-xl font-semibold mb-2">+50% света</h3>
              <p className="text-gray-600">Улучшение освещения дороги</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-4xl mb-3">⏱️</div>
              <h3 className="text-xl font-semibold mb-2">1-2 часа</h3>
              <p className="text-gray-600">Быстрое выполнение работ</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-4xl mb-3">🛡️</div>
              <h3 className="text-xl font-semibold mb-2">Защита</h3>
              <p className="text-gray-600">Покрытие защитным лаком</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Виды полировки</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Легкая полировка</h3>
                  <p className="text-gray-600 mb-2">Удаление легкого помутнения и царапин</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Очистка поверхности</li>
                    <li>• Полировка мелкоабразивной пастой</li>
                    <li>• Защитное покрытие</li>
                  </ul>
                </div>
                <div className="text-xl font-bold text-blue-600">От 1500₽</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Глубокая полировка</h3>
                  <p className="text-gray-600 mb-2">Удаление сильного помутнения, глубоких царапин</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Шлифовка наждачной бумагой</li>
                    <li>• Полировка в несколько этапов</li>
                    <li>• Нанесение защитного лака</li>
                  </ul>
                </div>
                <div className="text-xl font-bold text-blue-600">От 2500₽</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border-2 border-blue-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Premium полировка</h3>
                  <p className="text-gray-600 mb-2">Максимальное восстановление + долговременная защита</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Профессиональная шлифовка</li>
                    <li>• Полировка премиум-пастами</li>
                    <li>• Керамическое покрытие (до 2 лет защиты)</li>
                  </ul>
                </div>
                <div className="text-xl font-bold text-purple-600">От 4000₽</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">До и После</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 text-red-600">❌ До полировки:</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Мутные, желтые фары</li>
                  <li>• Царапины и потертости</li>
                  <li>• Плохое освещение дороги</li>
                  <li>• Неопрятный внешний вид</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-green-600">✅ После полировки:</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Кристально чистые фары</li>
                  <li>• Гладкая поверхность</li>
                  <li>• Яркий, четкий свет</li>
                  <li>• Как новые фары!</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <div className="bg-yellow-50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">📞 Записаться на полировку</h2>
          <p className="mb-4">Бесплатная оценка состояния фар и консультация:</p>
          <ul className="space-y-2 mb-6">
            <li>📱 Телефон: +7 (999) 123-45-67</li>
            <li>✉️ Email: info@aled-store.ru</li>
            <li>📍 Москва, ул. Примерная, д. 1</li>
          </ul>
          <Link 
            href="/services"
            className="inline-block bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition"
          >
            Все услуги
          </Link>
        </div>
      </div>
    </div>
  );
}

