'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductDetails } from '@/components/product/ProductDetails';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Loader } from '@/components/common/Loader';
import { ErrorMessage, NotFoundError } from '@/components/common/ErrorMessage';
import { getProductBySlug, getRelatedProducts } from '@/lib/api';
import { Product } from '@/types';

export default function ProductPage() {
  const params = useParams();
  const productSlug = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const fetchedProduct = await getProductBySlug(productSlug);
        
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          
          // Fetch related products
          const related = await getRelatedProducts(fetchedProduct.id, 4);
          setRelatedProducts(related);
        } else {
          setError('Товар не найден');
        }
      } catch (err) {
        setError('Ошибка загрузки товара');
      } finally {
        setLoading(false);
      }
    };

    if (productSlug) {
      fetchProduct();
    }
  }, [productSlug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Loader size="lg" text="Загрузка товара..." />
      </div>
    );
  }

  if (error === 'Товар не найден' || !product) {
    return (
      <NotFoundError
        title="Товар не найден"
        message="Запрашиваемый товар не существует или был удален."
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
    { label: product.name, href: `/product/${product.slug}` },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Product details */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Product gallery */}
          <div>
            <ProductGallery
              images={product.images}
              productName={product.name}
            />
          </div>

          {/* Product info (Характеристики и Доставка) */}
          <div>
            <ProductDetails product={product} />
          </div>
        </div>

        {/* Product description - под основным контентом */}
        <div className="mb-16">
          <div className="bg-white border border-secondary-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-secondary-900 mb-6">
              Описание товара
            </h2>
            <div className="prose max-w-none text-secondary-700">
              {product.description}
            </div>
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-secondary-900 mb-8">
              Похожие товары
            </h2>
            <ProductGrid products={relatedProducts} />
          </div>
        )}
      </div>
    </>
  );
}
