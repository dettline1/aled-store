'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  link?: string;
  buttonText?: string;
  isActive: boolean;
  order: number;
}

export function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/v1/banners');
      const data = await response.json();
      setBanners(data.data || []);
    } catch (error) {
      console.error('Ошибка загрузки баннеров:', error);
      // Используем дефолтный баннер при ошибке
      setBanners([{
        id: 'default',
        title: 'Автомобильное LED освещение нового поколения',
        subtitle: 'Би-LED линзы, ксеноновые комплекты, LED лампы и аксессуары для фар',
        link: '/catalog',
        buttonText: 'Смотреть каталог',
        isActive: true,
        order: 1
      }]);
    } finally {
      setLoading(false);
    }
  };

  const nextBanner = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  // Auto-rotation
  useEffect(() => {
    if (banners.length <= 1) return;
    
    const timer = setInterval(() => {
      nextBanner();
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length, currentIndex]);

  if (loading || banners.length === 0) {
    return (
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white overflow-hidden min-h-[500px] flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </section>
    );
  }

  const currentBanner = banners[currentIndex];

  return (
    <section className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
      {/* Banner Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 lg:py-24 min-h-[500px] flex items-center">
        {/* Background Image */}
        {currentBanner.image && (
          <div className="absolute inset-0 z-0">
            <img
              src={currentBanner.image}
              alt={currentBanner.title}
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
          </div>
        )}

        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in">
            {currentBanner.title}
          </h1>
          
          {currentBanner.subtitle && (
            <p className="text-xl lg:text-2xl mb-8 text-gray-200 leading-relaxed">
              {currentBanner.subtitle}
            </p>
          )}
          
          {currentBanner.link && (
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                <Link href={currentBanner.link}>
                  {currentBanner.buttonText || 'Подробнее'}
                </Link>
              </Button>
            </div>
          )}

          {/* Features */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Установка</h3>
                <p className="text-gray-300 text-sm">Профессиональный монтаж</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">4 города</h3>
                <p className="text-gray-300 text-sm">Сервисные центры</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Гарантия</h3>
                <p className="text-gray-300 text-sm">На все услуги</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows - показываем только если баннеров больше 1 */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevBanner}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all"
            aria-label="Предыдущий баннер"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={nextBanner}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all"
            aria-label="Следующий баннер"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-yellow-500 w-8' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Баннер ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-yellow-400/10 to-transparent z-0"></div>
    </section>
  );
}

