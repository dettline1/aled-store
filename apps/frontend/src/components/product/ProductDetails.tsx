'use client';

import { useState } from 'react';
import { Product, ProductVariation } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Rating } from '@/components/ui/Rating';
import { PriceTag } from './PriceTag';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';

interface ProductDetailsProps {
  product: Product;
  className?: string;
}

export function ProductDetails({ product, className }: ProductDetailsProps) {
  const { addItem } = useCart();
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'delivery'>('specs');

  const currentPrice = selectedVariation?.price || product.price;
  const isInStock = selectedVariation ? selectedVariation.inStock : product.inStock;

  const handleAddToCart = () => {
    addItem(product, selectedVariation || undefined);
  };

  const tabs = [
    { id: 'specs', label: 'Характеристики' },
    { id: 'delivery', label: 'Доставка' },
  ] as const;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Product header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="default" size="sm" className="capitalize">
            {product.brand}
          </Badge>
          {product.isNew && (
            <Badge variant="info" size="sm">
              Новинка
            </Badge>
          )}
          {!product.inStock && (
            <Badge variant="error" size="sm">
              Нет в наличии
            </Badge>
          )}
        </div>
        
        <h1 className="text-2xl lg:text-3xl font-bold text-secondary-900 mb-4">
          {product.name}
        </h1>

        <div className="flex items-center gap-4 mb-4">
          <Rating rating={product.rating} size="lg" showValue />
          <span className="text-secondary-500">
            {product.reviewsCount} отзывов
          </span>
        </div>

        <PriceTag 
          price={currentPrice} 
          originalPrice={product.originalPrice}
          size="xl" 
        />
      </div>

      {/* Variations */}
      {product.variations && product.variations.length > 0 && (
        <div>
          <h3 className="font-medium text-secondary-900 mb-3">
            Варианты:
          </h3>
          <div className="flex flex-wrap gap-2">
            {product.variations.map((variation) => (
              <button
                key={variation.id}
                onClick={() => setSelectedVariation(variation)}
                disabled={!variation.inStock}
                className={cn(
                  'px-4 py-2 border rounded-lg text-sm font-medium transition-colors',
                  selectedVariation?.id === variation.id
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-secondary-300 text-secondary-700 hover:border-secondary-400',
                  !variation.inStock && 'opacity-50 cursor-not-allowed'
                )}
              >
                {variation.value}
                {variation.price && variation.price !== product.price && (
                  <span className="ml-2 text-xs">
                    +{variation.price - product.price}₽
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity and add to cart */}
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <label htmlFor="quantity" className="text-sm font-medium text-secondary-700 mr-3">
            Количество:
          </label>
          <div className="flex items-center border border-secondary-300 rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 hover:bg-secondary-50 transition-colors"
              aria-label="Уменьшить количество"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 px-2 py-2 text-center border-0 focus:outline-none"
            />
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 hover:bg-secondary-50 transition-colors"
              aria-label="Увеличить количество"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={!isInStock}
          size="lg"
          className="flex-1 max-w-xs"
        >
          {isInStock ? 'Добавить в корзину' : 'Нет в наличии'}
        </Button>
      </div>

      {/* Tabs */}
      <div>
        <div className="border-b border-secondary-200">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="py-6">
          {activeTab === 'specs' && (
            <div className="space-y-3">
              {product.characteristics && Object.keys(product.characteristics).length > 0 ? (
                Object.entries(product.characteristics).map(([key, value]) => (
                  <div key={key} className="border-b border-secondary-100 pb-3">
                    <dt className="font-medium text-secondary-900 mb-1">{key}</dt>
                    <dd className="text-secondary-700 whitespace-pre-wrap">{value}</dd>
                  </div>
                ))
              ) : (
                <p className="text-secondary-500 text-center py-4">
                  Характеристики не указаны
                </p>
              )}
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-secondary-900 mb-2">Способы доставки:</h4>
                <ul className="space-y-2 text-secondary-700">
                  <li>• Самовывоз из магазина — бесплатно</li>
                  <li>• Курьерская доставка по Москве — 300₽</li>
                  <li>• Доставка по России — от 500₽</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-secondary-900 mb-2">Сроки доставки:</h4>
                <ul className="space-y-2 text-secondary-700">
                  <li>• По Москве — 1-2 дня</li>
                  <li>• По России — 3-7 дней</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
