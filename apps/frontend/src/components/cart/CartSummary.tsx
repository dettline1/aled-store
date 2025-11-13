'use client';

import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatPrice } from '@/lib/utils';

interface CartSummaryProps {
  showPromoCode?: boolean;
  className?: string;
}

export function CartSummary({ showPromoCode = true, className }: CartSummaryProps) {
  const { 
    subtotal, 
    discount, 
    shipping, 
    total, 
    promoCode, 
    applyPromoCode, 
    removePromoCode 
  } = useCart();
  
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    
    setIsApplyingPromo(true);
    setPromoError('');
    
    const success = applyPromoCode(promoInput.trim());
    
    if (success) {
      setPromoInput('');
    } else {
      setPromoError('Промокод не найден или не действителен');
    }
    
    setIsApplyingPromo(false);
  };

  const handleRemovePromo = () => {
    removePromoCode();
    setPromoError('');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Promo code */}
      {showPromoCode && (
        <div>
          {promoCode ? (
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div>
                <span className="text-sm font-medium text-green-800">
                  Промокод: {promoCode.code}
                </span>
                <p className="text-xs text-green-600">
                  Скидка {promoCode.type === 'percentage' ? `${promoCode.discount}%` : formatPrice(promoCode.discount)}
                </p>
              </div>
              <button
                onClick={handleRemovePromo}
                className="text-green-600 hover:text-green-800 transition-colors"
                aria-label="Удалить промокод"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Промокод"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                error={promoError}
                onKeyPress={(e) => e.key === 'Enter' && handleApplyPromo()}
              />
              <Button
                onClick={handleApplyPromo}
                disabled={!promoInput.trim() || isApplyingPromo}
                loading={isApplyingPromo}
                variant="outline"
                size="md"
              >
                Применить
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Summary */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-secondary-600">Товары:</span>
          <span className="text-secondary-900">{formatPrice(subtotal)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-secondary-600">Скидка:</span>
            <span className="text-green-600">−{formatPrice(discount)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-sm">
          <span className="text-secondary-600">Доставка:</span>
          <span className="text-secondary-900">
            {shipping === 0 ? 'Бесплатно' : formatPrice(shipping)}
          </span>
        </div>
        
        <div className="border-t border-secondary-200 pt-2">
          <div className="flex justify-between font-semibold text-lg">
            <span>Итого:</span>
            <span className="text-primary-600">{formatPrice(total)}</span>
          </div>
        </div>
        
        {shipping === 0 && subtotal >= 3000 && (
          <p className="text-sm text-green-600 text-center">
            🎉 Бесплатная доставка!
          </p>
        )}
        
        {shipping > 0 && subtotal < 3000 && (
          <p className="text-sm text-secondary-500 text-center">
            Добавьте товаров на {formatPrice(3000 - subtotal)} для бесплатной доставки
          </p>
        )}
      </div>
    </div>
  );
}
