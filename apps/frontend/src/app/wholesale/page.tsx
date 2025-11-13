import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export default function WholesalePage() {
  const breadcrumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Оптовикам', href: '/wholesale' },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-secondary-900 mb-8">
          Оптовым покупателям
        </h1>

        <div className="prose max-w-none">
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">
              Почему выгодно работать с нами?
            </h2>
            <ul className="space-y-3 text-secondary-700">
              <li>✅ Специальные цены для оптовых покупателей</li>
              <li>✅ Индивидуальный подход к каждому клиенту</li>
              <li>✅ Широкий ассортимент автомобильного освещения</li>
              <li>✅ Гарантия качества на всю продукцию</li>
              <li>✅ Быстрая доставка по всей России</li>
              <li>✅ Техническая поддержка и консультации</li>
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-primary-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-secondary-900 mb-3">
                Условия сотрудничества
              </h3>
              <p className="text-secondary-700 mb-3">
                Мы предлагаем гибкие условия для оптовых партнеров. Скидка зависит от объема заказа:
              </p>
              <ul className="space-y-2 text-secondary-700">
                <li>🎯 От 50 000 ₽ — скидка 10%</li>
                <li>🎯 От 100 000 ₽ — скидка 15%</li>
                <li>🎯 От 300 000 ₽ — скидка 20%</li>
              </ul>
            </div>

            <div className="bg-yellow-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-secondary-900 mb-3">
                Как начать работу?
              </h3>
              <ol className="space-y-3 text-secondary-700 list-decimal list-inside">
                <li>Свяжитесь с нами по телефону или через Telegram</li>
                <li>Обсудите условия и объемы поставок</li>
                <li>Получите индивидуальное коммерческое предложение</li>
                <li>Оформите заказ удобным способом</li>
              </ol>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Готовы начать сотрудничество?
            </h3>
            <p className="text-gray-800 mb-6">
              Свяжитесь с нами для получения индивидуального предложения
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+79634443522"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-md"
              >
                📞 +7 (963) 444 35 22
              </a>
              <a
                href="https://t.me/aaled_ru"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                Написать в Telegram
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

