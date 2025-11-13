'use client';

import Link from 'next/link';
import { useFeaturedProducts } from '@/hooks/useProducts';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/Button';

interface FeaturedProductsProps {
  title?: string;
  limit?: number;
}

export function FeaturedProducts({ 
  title = 'Рекомендуемые товары', 
  limit = 8 
}: FeaturedProductsProps) {
  const { products, loading, error } = useFeaturedProducts(limit);

  if (error) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600">Ошибка загрузки товаров</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-secondary-600 mb-6">
            Лучшие предложения от ведущих производителей
          </p>
          <div className="w-24 h-1 bg-primary-600 mx-auto"></div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(limit)].map((_, index) => (
              <div key={index} className="border border-secondary-200 rounded-lg overflow-hidden">
                <div className="aspect-square bg-secondary-200 animate-pulse"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-secondary-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-secondary-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-6 bg-secondary-200 rounded w-1/2 animate-pulse"></div>
                  <div className="h-10 bg-secondary-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <ProductGrid products={products} />
            
            {products.length > 0 && (
              <div className="text-center mt-12">
                <Button asChild variant="outline" size="lg">
                  <Link href="/catalog">
                    Смотреть все товары
                  </Link>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
