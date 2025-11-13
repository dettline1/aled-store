import Link from 'next/link';
import Image from 'next/image';
import { CartItem as CartItemType } from '@/types';
import { useCart } from '@/hooks/useCart';
import { formatPrice, getImagePlaceholder } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
  showImage?: boolean;
  className?: string;
}

export function CartItem({ item, showImage = true, className }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  
  const itemPrice = item.variation?.price || item.product.price;
  const totalPrice = itemPrice * item.quantity;

  return (
    <div className={`flex gap-4 ${className}`}>
      {/* Product image */}
      {showImage && (
        <Link href={`/product/${item.product.slug}`} className="flex-shrink-0">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-secondary-50">
            <Image
              src={item.product.images[0] || getImagePlaceholder(64, 64, 'Product')}
              alt={item.product.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
        </Link>
      )}

      {/* Product details */}
      <div className="flex-1 min-w-0">
        <Link 
          href={`/product/${item.product.slug}`}
          className="block hover:text-primary-600 transition-colors"
        >
          <h3 className="font-medium text-secondary-900 line-clamp-2">
            {item.product.name}
          </h3>
        </Link>

        {/* Variation */}
        {item.variation && (
          <p className="text-sm text-secondary-500 mt-1">
            {item.variation.name}: {item.variation.value}
          </p>
        )}

        {/* Price and quantity controls */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-2">
            {/* Quantity controls */}
            <div className="flex items-center border border-secondary-300 rounded">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="p-1 hover:bg-secondary-50 transition-colors"
                aria-label="Уменьшить количество"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              
              <span className="px-2 py-1 text-sm font-medium min-w-[2rem] text-center">
                {item.quantity}
              </span>
              
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="p-1 hover:bg-secondary-50 transition-colors"
                aria-label="Увеличить количество"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>

            {/* Remove button */}
            <button
              onClick={() => removeItem(item.id)}
              className="p-1 text-red-500 hover:text-red-700 transition-colors"
              aria-label="Удалить товар"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <div className="font-semibold text-secondary-900">
              {formatPrice(totalPrice)}
            </div>
            {item.quantity > 1 && (
              <div className="text-sm text-secondary-500">
                {formatPrice(itemPrice)} × {item.quantity}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
