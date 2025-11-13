'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Category } from '@/types';
import { getCategories } from '@/lib/api';

interface NavigationProps {
  isMobileMenuOpen: boolean;
  isDropdown?: boolean;
}

export function Navigation({ isMobileMenuOpen, isDropdown = false }: NavigationProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  // Dropdown для каталога (используется в Header)
  if (isDropdown) {
    return (
      <div className="absolute top-full left-0 mt-2 bg-white text-gray-900 shadow-xl rounded-lg min-w-[280px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-200">
        <div className="py-3">
          <Link
            href="/catalog"
            className="block px-5 py-2.5 hover:bg-gray-100 transition-colors font-semibold text-gray-900"
          >
            📦 Все товары
          </Link>
          <div className="border-t border-gray-200 my-2"></div>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/catalog/${category.slug}`}
              className="block px-5 py-2.5 hover:bg-gray-100 transition-colors text-gray-700 hover:text-gray-900"
            >
              {category.name}
              <span className="text-gray-500 text-sm ml-2">
                ({category.productsCount})
              </span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Mobile каталог (используется в мобильном меню)
  if (isMobileMenuOpen) {
    return (
      <div className="space-y-1 bg-white/10 rounded-lg p-2">
        <Link
          href="/catalog"
          className="block px-4 py-2 text-gray-900 font-medium hover:bg-yellow-600 hover:text-white rounded transition-all"
        >
          📦 Все товары
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/catalog/${category.slug}`}
            className="block px-4 py-2 text-gray-800 hover:bg-yellow-600 hover:text-white rounded transition-all text-sm"
          >
            {category.name} ({category.productsCount})
          </Link>
        ))}
      </div>
    );
  }

  return null;
}
