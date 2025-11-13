import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import Link from 'next/link';

export default function ArticlesPage() {
  const breadcrumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Статьи', href: '/articles' },
  ];

  // Примерные статьи - в будущем можно подключить к API
  const articles = [
    {
      id: 1,
      title: 'Как выбрать Би-LED линзы для автомобиля',
      excerpt: 'Подробное руководство по выбору правильных Би-LED линз для вашего автомобиля. Рассматриваем типы, характеристики и особенности установки.',
      date: '2025-10-15',
      category: 'Руководства',
      image: '/placeholder-article.jpg'
    },
    {
      id: 2,
      title: 'Сравнение ксенона и LED: что лучше?',
      excerpt: 'Детальное сравнение ксеноновых и LED ламп. Преимущества, недостатки, стоимость и эффективность каждого типа освещения.',
      date: '2025-10-10',
      category: 'Сравнения',
      image: '/placeholder-article.jpg'
    },
    {
      id: 3,
      title: 'Правила установки автомобильного освещения',
      excerpt: 'Юридические аспекты и технические требования к установке дополнительного освещения. Что можно и что нельзя.',
      date: '2025-10-05',
      category: 'Законодательство',
      image: '/placeholder-article.jpg'
    },
    {
      id: 4,
      title: 'Уход за фарами: советы и рекомендации',
      excerpt: 'Как правильно ухаживать за автомобильными фарами, чтобы они служили долго. Чистка, полировка и защита.',
      date: '2025-09-28',
      category: 'Обслуживание',
      image: '/placeholder-article.jpg'
    },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-secondary-900 mb-4">
          Статьи и руководства
        </h1>
        <p className="text-lg text-secondary-600 mb-12">
          Полезная информация об автомобильном освещении
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                <span className="text-white text-6xl">📄</span>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                    {article.category}
                  </span>
                  <time className="text-sm text-secondary-500">
                    {new Date(article.date).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
                
                <h2 className="text-xl font-bold text-secondary-900 mb-3 line-clamp-2">
                  {article.title}
                </h2>
                
                <p className="text-secondary-600 mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                
                <Link
                  href={`/articles/${article.id}`}
                  className="inline-flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700 transition-colors"
                >
                  Читать далее
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-yellow-50 rounded-lg p-8 inline-block">
            <p className="text-secondary-700 mb-4">
              💡 Не нашли ответ на свой вопрос?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-md"
            >
              Задать вопрос
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

