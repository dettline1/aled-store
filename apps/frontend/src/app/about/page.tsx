import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ContactForm } from '@/components/forms/ContactForm';

export const metadata = {
  title: 'О компании',
  description: 'ALED - ведущий поставщик качественного LED освещения. Узнайте больше о нашей истории, миссии и преимуществах работы с нами.',
};

export default function AboutPage() {
  const breadcrumbs = [
    { label: 'Главная', href: '/' },
    { label: 'О компании', href: '/about' },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-secondary-900 mb-6">
              О компании ALED
            </h1>
            <p className="text-xl text-secondary-600 leading-relaxed">
              Мы специализируемся на поставке качественного LED освещения 
              и помогаем создавать идеальную атмосферу в любом пространстве
            </p>
          </div>

          {/* Story */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold text-secondary-900 mb-6">
                Наша история
              </h2>
              <div className="space-y-4 text-secondary-700 leading-relaxed">
                <p>
                  Компания ALED была основана в 2020 году с целью предоставления 
                  российскому рынку качественных и доступных решений в области 
                  светодиодного освещения.
                </p>
                <p>
                  За годы работы мы зарекомендовали себя как надежный партнер 
                  для тысяч клиентов - от частных лиц до крупных коммерческих проектов.
                </p>
                <p>
                  Сегодня ALED - это команда профессионалов, которая продолжает 
                  развиваться и предлагать инновационные решения в сфере LED освещения.
                </p>
              </div>
            </div>
            
            <div className="bg-primary-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-primary-900 mb-6">
                Цифры и факты
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="text-3xl font-bold text-primary-600 mb-1">5000+</div>
                  <div className="text-primary-800">Довольных клиентов</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-600 mb-1">500+</div>
                  <div className="text-primary-800">Товаров в каталоге</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-600 mb-1">4 года</div>
                  <div className="text-primary-800">На рынке LED освещения</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-600 mb-1">24/7</div>
                  <div className="text-primary-800">Техническая поддержка</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mission & Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-secondary-900 mb-8 text-center">
              Наши ценности
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-3">Качество</h3>
                <p className="text-secondary-600">
                  Тщательно отбираем поставщиков и тестируем каждый товар перед поставкой
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-3">Надежность</h3>
                <p className="text-secondary-600">
                  Гарантируем стабильные поставки и выполнение всех обязательств
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-3">Поддержка</h3>
                <p className="text-secondary-600">
                  Консультируем клиентов на всех этапах - от выбора до установки
                </p>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="bg-secondary-50 p-8 lg:p-12 rounded-2xl">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-secondary-900 mb-6 text-center">
                Свяжитесь с нами
              </h2>
              <p className="text-lg text-secondary-600 mb-8 text-center">
                Есть вопросы о наших товарах или услугах? Мы с радостью ответим на них
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
