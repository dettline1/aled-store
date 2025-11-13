import { useCartStore } from '@/store/cart';

export const useCart = () => {
  const {
    items,
    isOpen,
    promoCode,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setIsOpen,
    applyPromoCode,
    removePromoCode,
    getItemsCount,
    getSubtotal,
    getDiscount,
    getShipping,
    getTotal,
  } = useCartStore();

  return {
    // State
    items,
    isOpen,
    promoCode,
    itemsCount: getItemsCount(),
    subtotal: getSubtotal(),
    discount: getDiscount(),
    shipping: getShipping(),
    total: getTotal(),
    
    // Actions
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart: () => setIsOpen(!isOpen),
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    applyPromoCode,
    removePromoCode,
  };
};
