import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Установка би-LED линз - ALED',
  description: 'Профессиональная установка светодиодных би-линз от 21000₽. Гарантия на работы. Записаться в Перми, Екатеринбурге, Челябинске, Набережных Челнах.',
};

export default function InstallationPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Установка би-LED линз
            </h1>
            <p className="text-xl lg:text-2xl text-primary-100 mb-8">
              Современные светодиодные би-линзы с идеальной светотеневой границей. 
              Профессиональная установка от 21 000 ₽.
            </p>
            <Button size="lg" asChild className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
              <Link href="/contact">
                Записаться на установку
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Process section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
              Процесс установки
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Детальный процесс установки би-LED линз с соблюдением всех технологических требований
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Демонтаж фар</h3>
              <p className="text-secondary-600">Аккуратный демонтаж фар с автомобиля и подготовка к разборке</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Разборка корпуса</h3>
              <p className="text-secondary-600">Профессиональная разборка фары с сохранением всех элементов</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Установка линз</h3>
              <p className="text-secondary-600">Монтаж би-LED модулей с точной центровкой и креплением</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-xl font-semibold mb-3">Настройка света</h3>
              <p className="text-secondary-600">Точная настройка светового пучка и светотеневой границы</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-xl font-bold mx-auto mb-4">
                5
              </div>
              <h3 className="text-xl font-semibold mb-3">Герметизация</h3>
              <p className="text-secondary-600">Качественная герметизация фары специальным герметиком</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-xl font-bold mx-auto mb-4">
                6
              </div>
              <h3 className="text-xl font-semibold mb-3">Финальная проверка</h3>
              <p className="text-secondary-600">Установка на автомобиль, регулировка и финальное тестирование</p>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages section */}
      <section className="py-16 bg-secondary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-center text-secondary-900 mb-12">
              Преимущества би-LED линз
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <svg className="w-6 h-6 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Яркий свет
                </h3>
                <p className="text-secondary-600">В 3-5 раз ярче штатных галогенных ламп. Световой поток до 13000 люкс на расстоянии 3 метра.</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <svg className="w-6 h-6 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Четкая граница
                </h3>
                <p className="text-secondary-600">Идеальная светотеневая граница не слепит встречных водителей и обеспечивает безопасность движения.</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <svg className="w-6 h-6 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Долговечность
                </h3>
                <p className="text-secondary-600">Срок службы LED модулей превышает 30000 часов работы. Не требуют частой замены.</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <svg className="w-6 h-6 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Экономичность
                </h3>
                <p className="text-secondary-600">Потребление энергии в 2 раза меньше галогенных ламп. Снижение нагрузки на генератор.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-12">
              Стоимость установки
            </h2>

            <div className="bg-primary-50 rounded-2xl p-8 border border-primary-200">
              <div className="text-6xl font-bold text-primary-600 mb-4">21 000 ₽</div>
              <div className="text-xl text-secondary-700 mb-6">Установка би-LED линз под ключ</div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-8">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Демонтаж и разборка фар</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Установка би-LED модулей</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Настройка светового пучка</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Герметизация фар</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Регулировка на автомобиле</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Гарантия на работы</span>
                  </div>
                </div>
              </div>

              <p className="text-secondary-600 text-sm mb-6">
                *Стоимость указана без учета би-LED модулей. Цена линз рассчитывается отдельно в зависимости от выбранной модели.
              </p>

              <Button size="lg" asChild className="bg-primary-600 hover:bg-primary-700">
                <Link href="/contact">
                  Записаться на установку
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Нужна консультация по установке?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Наши специалисты помогут подобрать подходящие би-LED модули и рассчитают точную стоимость установки
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
              <Link href="/contact">
                Получить консультацию
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white hover:text-primary-600">
              <Link href="tel:+79634443522">
                +7 (963) 444 35 22
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
