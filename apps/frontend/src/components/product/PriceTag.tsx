import { formatPrice, getDiscountPercentage } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface PriceTagProps {
  price: number;
  originalPrice?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function PriceTag({ price, originalPrice, size = 'md', className }: PriceTagProps) {
  const hasDiscount = originalPrice && originalPrice > price;
  const discount = hasDiscount ? getDiscountPercentage(originalPrice, price) : 0;

  const sizes = {
    sm: {
      price: 'text-base font-semibold',
      original: 'text-sm',
      discount: 'text-xs',
    },
    md: {
      price: 'text-lg font-semibold',
      original: 'text-base',
      discount: 'text-sm',
    },
    lg: {
      price: 'text-xl font-bold',
      original: 'text-lg',
      discount: 'text-sm',
    },
    xl: {
      price: 'text-2xl font-bold',
      original: 'text-xl',
      discount: 'text-base',
    },
  };

  return (
    <div className={cn('flex items-baseline gap-2', className)}>
      {/* Current price */}
      <span className={cn(
        sizes[size].price,
        hasDiscount ? 'text-red-600' : 'text-secondary-900'
      )}>
        {formatPrice(price)}
      </span>

      {/* Original price */}
      {hasDiscount && originalPrice && (
        <>
          <span className={cn(
            sizes[size].original,
            'text-secondary-500 line-through'
          )}>
            {formatPrice(originalPrice)}
          </span>
          
          {/* Discount percentage */}
          <span className={cn(
            sizes[size].discount,
            'text-red-600 font-medium'
          )}>
            −{discount}%
          </span>
        </>
      )}
    </div>
  );
}
