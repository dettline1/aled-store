'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/Button';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';
import { cn } from '@/lib/utils';

export function CartDrawer() {
  const { isOpen, closeCart, items } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-50 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transition-transform duration-300 flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-secondary-200">
          <h2 className="text-lg font-semibold text-secondary-900">
            Корзина ({items.length})
          </h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
            aria-label="Закрыть корзину"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto text-secondary-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15.5M9 19.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM20 19.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              <h3 className="text-lg font-medium text-secondary-900 mb-2">
                Корзина пуста
              </h3>
              <p className="text-secondary-500 mb-4">
                Добавьте товары в корзину, чтобы оформить заказ
              </p>
              <Button
                onClick={closeCart}
                variant="outline"
                asChild
              >
                <Link href="/catalog">
                  Перейти в каталог
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-secondary-200 p-4 space-y-4">
              <CartSummary />
              
              <div className="space-y-2">
                <Button
                  className="w-full"
                  asChild
                  onClick={closeCart}
                >
                  <Link href="/checkout">
                    Оформить заказ
                  </Link>
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  asChild
                  onClick={closeCart}
                >
                  <Link href="/cart">
                    Перейти в корзину
                  </Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
