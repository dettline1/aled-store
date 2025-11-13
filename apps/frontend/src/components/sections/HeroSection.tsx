import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { getImagePlaceholder } from '@/lib/utils';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={getImagePlaceholder(1920, 700, 'Hero Banner')}
          alt="LED освещение"
          fill
          className="object-cover opacity-20"
          priority
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-3xl">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            Автомобильное{' '}
            <span className="text-yellow-400">LED освещение</span>{' '}
            нового поколения
          </h1>
          
          <p className="text-xl lg:text-2xl mb-8 text-primary-100 leading-relaxed">
            Би-LED линзы, ксеноновые комплекты, LED лампы и аксессуары для фар. 
            Профессиональная установка в 4 городах России.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
              <Link href="/catalog">
                Смотреть каталог
              </Link>
            </Button>
            
            <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white hover:text-primary-600">
              <Link href="/about">
                Узнать больше
              </Link>
            </Button>
          </div>
          
          {/* Features */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Установка</h3>
                <p className="text-primary-200 text-sm">Профессиональный монтаж</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">4 города</h3>
                <p className="text-primary-200 text-sm">Сервисные центры</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Гарантия</h3>
                <p className="text-primary-200 text-sm">На все услуги</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-yellow-400/10 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/20 to-transparent"></div>
    </section>
  );
}
