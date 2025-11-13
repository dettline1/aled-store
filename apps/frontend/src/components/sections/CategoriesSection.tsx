'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types';
import { getCategories } from '@/lib/api';
import { getImagePlaceholder } from '@/lib/utils';

export function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-secondary-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
              Категории товаров
            </h2>
            <div className="w-24 h-1 bg-primary-600 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="group">
                <div className="relative aspect-square bg-secondary-200 rounded-lg mb-4 animate-pulse"></div>
                <div className="h-4 bg-secondary-200 rounded mb-2 animate-pulse"></div>
                <div className="h-3 bg-secondary-200 rounded w-2/3 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-secondary-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
            Категории товаров
          </h2>
          <p className="text-lg text-secondary-600 mb-6">
            Выберите нужную категорию для быстрого поиска товаров
          </p>
          <div className="w-24 h-1 bg-primary-600 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/catalog/${category.slug}`}
              className="group"
            >
              <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 mb-4">
                <Image
                  src={category.image || getImagePlaceholder(300, 300, category.name)}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Category icon/badge */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                
                {/* Product count badge */}
                <div className="absolute bottom-4 left-4 bg-white/90 px-2 py-1 rounded-full text-xs font-medium text-secondary-700">
                  {category.productsCount} товаров
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors duration-200 mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-secondary-600 line-clamp-2">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link
            href="/catalog"
            className="inline-flex items-center px-6 py-3 border border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white transition-colors duration-200 rounded-lg font-medium"
          >
            Смотреть все товары
            <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
