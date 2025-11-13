import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Гарантия | ALed Store',
  description: 'Гарантийное обслуживание и возврат товаров',
};

export default function WarrantyPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Гарантия и возврат</h1>
      
      <div className="prose max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">🛡️ Гарантия на продукцию</h2>
          
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-xl font-semibold mb-3">Би-LED линзы</h3>
            <p className="mb-2">✅ <strong>Гарантия:</strong> 2 года</p>
            <p className="text-gray-600">Покрывает производственные дефекты и неисправности при нормальной эксплуатации</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-xl font-semibold mb-3">LED лампы</h3>
            <p className="mb-2">✅ <strong>Гарантия:</strong> 1-2 года (зависит от модели)</p>
            <p className="text-gray-600">Бесплатная замена в случае выхода из строя</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-3">Аксессуары</h3>
            <p className="mb-2">✅ <strong>Гарантия:</strong> 6-12 месяцев</p>
            <p className="text-gray-600">Гарантия на герметики, инструменты и прочие аксессуары</p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">🔄 Обмен и возврат</h2>
          
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-3">Возврат в течение 14 дней</h3>
            <p className="mb-4">Вы можете вернуть товар надлежащего качества в течение 14 дней с момента покупки:</p>
            <ul className="space-y-2">
              <li>✅ Товарный вид сохранен</li>
              <li>✅ Упаковка не повреждена</li>
              <li>✅ Наличие всех документов и бирок</li>
              <li>✅ Товар не был в употреблении</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-3">Обмен товара</h3>
            <p className="mb-4">Обмен возможен при:</p>
            <ul className="space-y-2">
              <li>• Несоответствии характеристик</li>
              <li>• Производственном браке</li>
              <li>• Повреждении при доставке</li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">📋 Порядок возврата</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-4xl mb-3">1️⃣</div>
              <h3 className="font-semibold mb-2">Свяжитесь с нами</h3>
              <p className="text-sm text-gray-600">Позвоните или напишите о возврате</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-4xl mb-3">2️⃣</div>
              <h3 className="font-semibold mb-2">Отправьте товар</h3>
              <p className="text-sm text-gray-600">В оригинальной упаковке с документами</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-4xl mb-3">3️⃣</div>
              <h3 className="font-semibold mb-2">Получите деньги</h3>
              <p className="text-sm text-gray-600">В течение 10 дней после проверки</p>
            </div>
          </div>
        </section>

        <section className="bg-green-50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">💚 Наши гарантии</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <strong>Оригинальная продукция</strong>
                <p className="text-gray-600">Работаем только с проверенными производителями</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <strong>Быстрая замена</strong>
                <p className="text-gray-600">Обмен товара в кратчайшие сроки</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <strong>Техподдержка</strong>
                <p className="text-gray-600">Консультации по установке и эксплуатации</p>
              </div>
            </li>
          </ul>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-6 mt-8">
          <h2 className="text-2xl font-semibold mb-4">📞 Контакты</h2>
          <ul className="space-y-2">
            <li>📱 <strong>Телефон:</strong> +7 (999) 123-45-67</li>
            <li>✉️ <strong>Email:</strong> info@aled-store.ru</li>
            <li>⏰ <strong>Время работы:</strong> Пн-Пт 10:00-20:00, Сб-Вс 11:00-18:00</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

