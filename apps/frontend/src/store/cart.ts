import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, ProductVariation, PromoCode } from '@/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  promoCode: PromoCode | null;
}

interface CartActions {
  addItem: (product: Product, variation?: ProductVariation) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  getItemsCount: () => number;
  getSubtotal: () => number;
  getDiscount: () => number;
  getShipping: () => number;
  getTotal: () => number;
}

type CartStore = CartState & CartActions;

// Фиктивные промокоды
const PROMO_CODES: Record<string, PromoCode> = {
  'SAVE10': { code: 'SAVE10', discount: 10, type: 'percentage' },
  'SAVE200': { code: 'SAVE200', discount: 200, type: 'fixed', minAmount: 2000 },
  'FIRST15': { code: 'FIRST15', discount: 15, type: 'percentage' },
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      promoCode: null,

      addItem: (product: Product, variation?: ProductVariation) => {
        const state = get();
        const itemPrice = variation?.price || product.price;
        const existingItemIndex = state.items.findIndex(
          item => 
            item.productId === product.id && 
            item.variationId === variation?.id
        );

        if (existingItemIndex >= 0) {
          // Увеличиваем количество существующего товара
          const updatedItems = [...state.items];
          updatedItems[existingItemIndex].quantity += 1;
          set({ items: updatedItems });
        } else {
          // Добавляем новый товар
          const newItem: CartItem = {
            id: `${product.id}-${variation?.id || 'default'}-${Date.now()}`,
            productId: product.id,
            product,
            quantity: 1,
            variationId: variation?.id,
            variation,
          };
          set({ items: [...state.items, newItem] });
        }
      },

      removeItem: (itemId: string) => {
        const state = get();
        set({ items: state.items.filter(item => item.id !== itemId) });
      },

      updateQuantity: (itemId: string, quantity: number) => {
        const state = get();
        if (quantity <= 0) {
          set({ items: state.items.filter(item => item.id !== itemId) });
        } else {
          const updatedItems = state.items.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          );
          set({ items: updatedItems });
        }
      },

      clearCart: () => {
        set({ items: [], promoCode: null });
      },

      setIsOpen: (isOpen: boolean) => {
        set({ isOpen });
      },

      applyPromoCode: (code: string) => {
        const promo = PROMO_CODES[code.toUpperCase()];
        if (!promo) return false;

        const subtotal = get().getSubtotal();
        if (promo.minAmount && subtotal < promo.minAmount) {
          return false;
        }

        set({ promoCode: promo });
        return true;
      },

      removePromoCode: () => {
        set({ promoCode: null });
      },

      getItemsCount: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        const state = get();
        return state.items.reduce((total, item) => {
          const price = item.variation?.price || item.product.price;
          return total + (price * item.quantity);
        }, 0);
      },

      getDiscount: () => {
        const state = get();
        if (!state.promoCode) return 0;

        const subtotal = get().getSubtotal();
        if (state.promoCode.type === 'percentage') {
          return Math.round((subtotal * state.promoCode.discount) / 100);
        } else {
          return state.promoCode.discount;
        }
      },

      getShipping: () => {
        const subtotal = get().getSubtotal();
        // Бесплатная доставка от 3000 рублей
        return subtotal >= 3000 ? 0 : 300;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const shipping = get().getShipping();
        return Math.max(0, subtotal - discount + shipping);
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ 
        items: state.items, 
        promoCode: state.promoCode 
      }),
    }
  )
);
