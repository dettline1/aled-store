'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { SearchForm } from '@/components/forms/SearchForm';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Navigation } from './Navigation';
import { cn } from '@/lib/utils';

export function Header() {
  const { itemsCount, openCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Fixed header - желтая шапка как на aaled.ru */}
      <header className="bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          {/* Главная шапка - меню и кнопки */}
          <div className="flex items-center justify-between py-3">
            {/* Логотип */}
            <Link href="/" className="flex items-center space-x-3 flex-shrink-0">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-md">
                <span className="text-yellow-500 font-bold text-2xl">A</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ALED</h1>
                <p className="text-xs text-gray-700">Автомобильное освещение</p>
              </div>
            </Link>

            {/* Навигация - десктоп */}
            <nav className="hidden lg:flex items-center space-x-1 flex-1 justify-center">
              <Link href="/" className="px-4 py-2 text-gray-900 font-medium hover:bg-yellow-600 hover:text-white rounded transition-all">
                Главная
              </Link>
              <Link href="/wholesale" className="px-4 py-2 text-gray-900 font-medium hover:bg-yellow-600 hover:text-white rounded transition-all">
                Оптовикам
              </Link>
              <Link href="/articles" className="px-4 py-2 text-gray-900 font-medium hover:bg-yellow-600 hover:text-white rounded transition-all">
                Статьи
              </Link>
              <Link href="/blog" className="px-4 py-2 text-gray-900 font-medium hover:bg-yellow-600 hover:text-white rounded transition-all">
                Блог
              </Link>
              <Link href="/about" className="px-4 py-2 text-gray-900 font-medium hover:bg-yellow-600 hover:text-white rounded transition-all">
                О нас
              </Link>
              <Link href="/contact" className="px-4 py-2 text-gray-900 font-medium hover:bg-yellow-600 hover:text-white rounded transition-all">
                Контакты
              </Link>
            </nav>

            {/* Кнопки справа */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              {/* Кнопка "Связаться с нами" - красная */}
              <a
                href="https://t.me/aaled_ru"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-600 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                Связаться
              </a>

              {/* Корзина */}
              <button
                onClick={openCart}
                className="relative p-2 text-gray-900 hover:bg-yellow-600 hover:text-white rounded-lg transition-all"
                aria-label="Корзина"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15.5M9 19.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM20 19.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                {itemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {itemsCount > 99 ? '99+' : itemsCount}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-900 hover:bg-yellow-600 hover:text-white rounded-lg transition-all"
                aria-label="Меню"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Вторая строка - Каталог слева + Поиск справа */}
          <div className="hidden lg:flex items-center gap-4 pb-3">
            {/* Dropdown каталог слева */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-md">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Каталог товаров
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {/* Dropdown меню */}
              <Navigation isMobileMenuOpen={false} isDropdown={true} />
            </div>

            {/* Поиск справа */}
            <div className="flex-1 max-w-2xl">
              <SearchForm />
            </div>
          </div>

          {/* Mobile menu */}
          <div className={cn(
            'lg:hidden transition-all duration-300 overflow-hidden',
            isMobileMenuOpen ? 'max-h-screen pb-4 opacity-100' : 'max-h-0 opacity-0'
          )}>
            <nav className="space-y-1 pt-2">
              <Link href="/" className="block px-4 py-2 text-gray-900 font-medium hover:bg-yellow-600 hover:text-white rounded transition-all">
                Главная
              </Link>
              <Link href="/wholesale" className="block px-4 py-2 text-gray-900 font-medium hover:bg-yellow-600 hover:text-white rounded transition-all">
                Оптовикам
              </Link>
              <Link href="/articles" className="block px-4 py-2 text-gray-900 font-medium hover:bg-yellow-600 hover:text-white rounded transition-all">
                Статьи
              </Link>
              <Link href="/blog" className="block px-4 py-2 text-gray-900 font-medium hover:bg-yellow-600 hover:text-white rounded transition-all">
                Блог
              </Link>
              <Link href="/about" className="block px-4 py-2 text-gray-900 font-medium hover:bg-yellow-600 hover:text-white rounded transition-all">
                О нас
              </Link>
              <Link href="/contact" className="block px-4 py-2 text-gray-900 font-medium hover:bg-yellow-600 hover:text-white rounded transition-all">
                Контакты
              </Link>
              
              {/* Mobile catalog and search */}
              <div className="pt-3 space-y-3">
                <Navigation isMobileMenuOpen={true} isDropdown={false} />
                <div className="px-2">
                  <SearchForm />
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <CartDrawer />
    </>
  );
}
