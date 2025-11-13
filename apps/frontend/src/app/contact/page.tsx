import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ContactForm } from '@/components/forms/ContactForm';

export const metadata = {
  title: 'Контакты',
  description: 'Свяжитесь с нами любым удобным способом. Телефон, email, адрес офиса и форма обратной связи.',
};

export default function ContactPage() {
  const breadcrumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Контакты', href: '/contact' },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-secondary-900 mb-6">
              Контакты
            </h1>
            <p className="text-xl text-secondary-600">
              Свяжитесь с нами любым удобным способом
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-secondary-900 mb-8">
                Информация для связи
              </h2>
              
              <div className="space-y-8">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900 mb-1">Телефон</h3>
                    <p className="text-secondary-600 mb-2">
                      <a href="tel:+78001234567" className="hover:text-primary-600 transition-colors">
                        +7 (800) 123-45-67
                      </a>
                    </p>
                    <p className="text-sm text-secondary-500">Бесплатный звонок по России</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900 mb-1">Email</h3>
                    <p className="text-secondary-600 mb-2">
                      <a href="mailto:info@aled.ru" className="hover:text-primary-600 transition-colors">
                        info@aled.ru
                      </a>
                    </p>
                    <p className="text-sm text-secondary-500">Общие вопросы</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900 mb-1">Адрес</h3>
                    <p className="text-secondary-600 mb-2">
                      Москва, ул. Примерная, д. 123, офис 456
                    </p>
                    <p className="text-sm text-secondary-500">Самовывоз и офис продаж</p>
                  </div>
                </div>

                {/* Working hours */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900 mb-1">Режим работы</h3>
                    <div className="text-secondary-600 space-y-1">
                      <p>Пн-Пт: 9:00 - 18:00</p>
                      <p>Сб: 10:00 - 16:00</p>
                      <p>Вс: выходной</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="mt-8 bg-secondary-200 rounded-lg p-8 text-center">
                <svg className="w-16 h-16 mx-auto text-secondary-400 mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <p className="text-secondary-600">Интерактивная карта</p>
                <p className="text-sm text-secondary-500 mt-1">Здесь будет отображаться карта с нашим местоположением</p>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-secondary-900 mb-8">
                Напишите нам
              </h2>
              <div className="bg-white p-8 rounded-lg border border-secondary-200">
                <ContactForm />
              </div>
            </div>
          </div>

          {/* Additional info */}
          <div className="mt-16 bg-primary-50 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-primary-900 mb-6 text-center">
              Дополнительная информация
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-primary-800 mb-3">Для поставщиков</h3>
                <p className="text-primary-700 mb-2">
                  Email: suppliers@aled.ru
                </p>
                <p className="text-sm text-primary-600">
                  По вопросам сотрудничества и поставок
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-primary-800 mb-3">Техническая поддержка</h3>
                <p className="text-primary-700 mb-2">
                  Email: support@aled.ru
                </p>
                <p className="text-sm text-primary-600">
                  Помощь в выборе и установке оборудования
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
