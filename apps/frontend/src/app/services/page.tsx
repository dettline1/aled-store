import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Услуги - ALED',
  description: 'Профессиональная установка би-LED линз, ремонт и восстановление фар, замена стекол. Сервисы в 4 городах России.',
};

export default function ServicesPage() {
  const services = [
    {
      id: '1',
      title: 'Установка би-LED линз',
      description: 'Профессиональная установка светодиодных би-линз с настройкой светового пучка',
      price: 'от 21 000 ₽',
      features: [
        'Демонтаж и разборка фар',
        'Установка би-LED линз',
        'Настройка светового пучка',
        'Герметизация фар',
        'Проверка и регулировка',
        'Гарантия на работы'
      ],
      image: '/images/services/installation.jpg'
    },
    {
      id: '2',
      title: 'Замена линз',
      description: 'Замена старых или поврежденных линз на новые би-LED модули',
      price: 'от 9 000 ₽',
      features: [
        'Диагностика состояния линз',
        'Подбор совместимых модулей',
        'Демонтаж старых линз',
        'Установка новых линз',
        'Настройка и регулировка',
        'Тестирование работы'
      ],
      image: '/images/services/lens-replacement.jpg'
    },
    {
      id: '3',
      title: 'Замена стекол фар',
      description: 'Восстановление фар после ДТП или помутнения стекол',
      price: 'от 5 000 ₽',
      features: [
        'Демонтаж поврежденного стекла',
        'Подбор оригинального стекла',
        'Очистка и подготовка корпуса',
        'Установка нового стекла',
        'Герметизация швов',
        'Проверка герметичности'
      ],
      image: '/images/services/glass-replacement.jpg'
    },
    {
      id: '4',
      title: 'Диагностика блоков',
      description: 'Диагностика и ремонт блоков управления освещением',
      price: 'от 7 000 ₽',
      features: [
        'Компьютерная диагностика',
        'Проверка электрических цепей',
        'Тестирование блоков розжига',
        'Выявление неисправностей',
        'Ремонт или замена блоков',
        'Проверка после ремонта'
      ],
      image: '/images/services/diagnostics.jpg'
    },
    {
      id: '5',
      title: 'Полировка фар',
      description: 'Восстановление прозрачности помутневших фар',
      price: 'от 2 500 ₽',
      features: [
        'Оценка степени помутнения',
        'Шлифовка поверхности',
        'Полировка абразивными пастами',
        'Нанесение защитного покрытия',
        'Проверка качества света',
        'UV-защита от повторного помутнения'
      ],
      image: '/images/services/polishing.jpg'
    },
    {
      id: '6',
      title: 'Оклейка фар пленкой',
      description: 'Защита фар полиуретановой пленкой от сколов и царапин',
      price: 'от 3 500 ₽',
      features: [
        'Подготовка поверхности фар',
        'Раскрой защитной пленки',
        'Профессиональная оклейка',
        'Удаление воздушных пузырей',
        'Обрезка и подгонка краев',
        'Гарантия на материал и работу'
      ],
      image: '/images/services/film-protection.jpg'
    }
  ];

  const cities = [
    {
      name: 'Пермь',
      address: 'ул. Крисанова, 73А',
      phone: '+7 (963) 444 35 22',
      hours: '10:00 — 20:00'
    },
    {
      name: 'Екатеринбург', 
      address: 'Луганская ул., 59, корп. 1Б',
      phone: '+7 (963) 444 35 22',
      hours: '10:00 — 20:00'
    },
    {
      name: 'Челябинск',
      address: 'Механическая ул., 115Б',
      phone: '+7 (963) 444 35 22',
      hours: '10:00 — 20:00'
    },
    {
      name: 'Набережные Челны',
      address: 'Звоните для уточнения адреса',
      phone: '+7 (963) 444 35 22',
      hours: '10:00 — 20:00'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Профессиональные услуги для автомобильного освещения
            </h1>
            <p className="text-xl lg:text-2xl text-primary-100 mb-8">
              Установка, ремонт и диагностика фар в 4 городах России. 
              Опыт работы более 7 лет, гарантия на все виды работ.
            </p>
            <Button size="lg" asChild className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
              <Link href="/contact">
                Записаться на установку
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
              Наши услуги
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Полный спектр работ по автомобильному освещению от диагностики до установки премиальных би-LED систем
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video bg-secondary-100 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-secondary-400">
                    <span className="text-sm">Изображение: {service.title}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-secondary-900">{service.title}</h3>
                    <span className="text-lg font-bold text-primary-600">{service.price}</span>
                  </div>
                  
                  <p className="text-secondary-600 mb-4">{service.description}</p>
                  
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-secondary-700">
                        <svg className="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button className="w-full" asChild>
                    <Link href="/contact">
                      Записаться на {service.title.toLowerCase()}
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cities section */}
      <section className="py-16 bg-secondary-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
              Наши сервисные центры
            </h2>
            <p className="text-lg text-secondary-600">
              Профессиональная установка и обслуживание в 4 городах
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cities.map((city, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 text-center">
                <h3 className="text-xl font-bold text-primary-600 mb-3">{city.name}</h3>
                <div className="space-y-2 text-sm text-secondary-600">
                  <p className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {city.address}
                  </p>
                  <p className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    {city.phone}
                  </p>
                  <p className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    {city.hours}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Готовы улучшить освещение вашего автомобиля?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Бесплатная консультация и подбор оптимального решения для вашего автомобиля
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
              <Link href="/contact">
                Записаться на консультацию
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white hover:text-primary-600">
              <Link href="tel:+79634443522">
                Позвонить сейчас
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
