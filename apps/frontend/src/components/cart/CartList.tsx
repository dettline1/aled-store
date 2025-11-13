import { useCart } from '@/hooks/useCart';
import { CartItem } from './CartItem';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface CartListProps {
  className?: string;
}

export function CartList({ className }: CartListProps) {
  const { items, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="max-w-md mx-auto">
          <svg className="w-16 h-16 mx-auto text-secondary-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15.5M9 19.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM20 19.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
          <h2 className="text-xl font-semibold text-secondary-900 mb-2">
            Корзина пуста
          </h2>
          <p className="text-secondary-500 mb-6">
            Добавьте товары в корзину, чтобы оформить заказ
          </p>
          <Button asChild>
            <Link href="/catalog">
              Перейти в каталог
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-secondary-900">
          Товары в корзине ({items.length})
        </h2>
        
        <Button
          onClick={clearCart}
          variant="outline"
          size="sm"
        >
          Очистить корзину
        </Button>
      </div>

      {/* Items */}
      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.id} className="border-b border-secondary-200 pb-6 last:border-b-0 last:pb-0">
            <CartItem item={item} showImage={true} />
          </div>
        ))}
      </div>
    </div>
  );
}
