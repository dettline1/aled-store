'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Pagination } from '@/components/common/Pagination';
import { Loader } from '@/components/common/Loader';
import { ErrorMessage, NotFoundError } from '@/components/common/ErrorMessage';
import { useProducts } from '@/hooks/useProducts';
import { getCategoryBySlug } from '@/lib/api';
import { parseSearchParams, updateSearchParams } from '@/lib/filters';
import { Category } from '@/types';

export default function CategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const categorySlug = params.category as string;
  
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentParams = {
    ...parseSearchParams(searchParams),
    category: categorySlug,
  };

  const { products, pagination, loading: productsLoading, error: productsError } = useProducts(currentParams);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const fetchedCategory = await getCategoryBySlug(categorySlug);
        
        if (fetchedCategory) {
          setCategory(fetchedCategory);
        } else {
          setError('Категория не найдена');
        }
      } catch (err) {
        setError('Ошибка загрузки категории');
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug) {
      fetchCategory();
    }
  }, [categorySlug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Loader size="lg" text="Загрузка категории..." />
      </div>
    );
  }

  if (error === 'Категория не найдена' || !category) {
    return (
      <NotFoundError
        title="Категория не найдена"
        message="Запрашиваемая категория не существует или была перемещена."
        showHomeButton={false}
      />
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <ErrorMessage message={error} />
      </div>
    );
  }

  const breadcrumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Каталог', href: '/catalog' },
    { label: category.name, href: `/catalog/${category.slug}` },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Category header */}
        <div className="mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
            {category.name}
          </h1>
          <p className="text-lg text-secondary-600 mb-6">
            {category.description}
          </p>
          
          {pagination && (
            <div className="flex items-center gap-4 text-sm text-secondary-500">
              <span>Найдено: {pagination.total} товаров</span>
              {pagination.totalPages > 1 && (
                <span>•</span>
              )}
              {pagination.totalPages > 1 && (
                <span>Страница {pagination.page} из {pagination.totalPages}</span>
              )}
            </div>
          )}
        </div>

        {/* Loading state */}
        {productsLoading && (
          <div className="py-12">
            <Loader size="lg" text="Загрузка товаров..." />
          </div>
        )}

        {/* Error state */}
        {productsError && (
          <div className="py-12">
            <ErrorMessage message={productsError} />
          </div>
        )}

        {/* Products */}
        {!productsLoading && !productsError && (
          <>
            {products.length === 0 ? (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <svg className="w-16 h-16 mx-auto text-secondary-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <h3 className="text-lg font-medium text-secondary-900 mb-2">
                    Товары скоро появятся
                  </h3>
                  <p className="text-secondary-500 mb-6">
                    В категории "{category.name}" пока нет товаров. Следите за обновлениями.
                  </p>
                  <a
                    href="/catalog"
                    className="inline-flex items-center px-4 py-2 border border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white transition-colors rounded-lg"
                  >
                    Смотреть все категории
                  </a>
                </div>
              </div>
            ) : (
              <>
                <ProductGrid products={products} />
                
                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-12">
                    <Pagination pagination={pagination} />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
