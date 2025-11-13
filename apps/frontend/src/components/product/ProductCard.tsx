import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Rating } from '@/components/ui/Rating';
import { PriceTag } from './PriceTag';
import { useCart } from '@/hooks/useCart';
import { formatPrice, getImagePlaceholder } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  return (
    <div className={`group relative bg-white rounded-lg border border-secondary-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 ${className}`}>
      <Link href={`/product/${product.slug}`}>
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-secondary-50">
          <Image
            src={product.images[0] || getImagePlaceholder(400, 400, 'Product')}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <Badge variant="info" size="sm">
                Новинка
              </Badge>
            )}
            {product.discount && (
              <Badge variant="error" size="sm">
                -{product.discount}%
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="default" size="sm">
                Нет в наличии
              </Badge>
            )}
          </div>

          {/* Quick actions */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              className="p-2 bg-white rounded-full shadow-lg hover:bg-secondary-50 transition-colors"
              aria-label="В избранное"
            >
              <svg className="w-5 h-5 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Brand */}
          <p className="text-sm text-secondary-500 mb-1 capitalize">
            {product.brand}
          </p>

          {/* Title */}
          <h3 className="font-medium text-secondary-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <Rating rating={product.rating} size="sm" />
            <span className="text-sm text-secondary-500">
              ({product.reviewsCount})
            </span>
          </div>

          {/* Price */}
          <div className="mb-4">
            <PriceTag
              price={product.price}
              originalPrice={product.originalPrice}
              size="lg"
            />
          </div>

          {/* Add to cart button */}
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full"
            size="sm"
          >
            {product.inStock ? 'В корзину' : 'Нет в наличии'}
          </Button>
        </div>
      </Link>
    </div>
  );
}
