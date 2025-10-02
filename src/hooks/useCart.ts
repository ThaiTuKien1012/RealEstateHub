import { create } from 'zustand';
import { CartItem, Product, ProductVariant } from '../types';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity: number, variant?: ProductVariant) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],

  addItem: (product, quantity, variant) => {
    set(state => {
      const existingItemIndex = state.items.findIndex(
        item =>
          item.product.id === product.id &&
          item.selectedVariant?.id === variant?.id
      );

      if (existingItemIndex > -1) {
        const newItems = [...state.items];
        newItems[existingItemIndex].quantity += quantity;
        return { items: newItems };
      }

      return {
        items: [...state.items, { product, quantity, selectedVariant: variant }],
      };
    });
  },

  removeItem: (productId, variantId) => {
    set(state => ({
      items: state.items.filter(
        item =>
          !(
            item.product.id === productId &&
            item.selectedVariant?.id === variantId
          )
      ),
    }));
  },

  updateQuantity: (productId, quantity, variantId) => {
    set(state => {
      const newItems = state.items.map(item => {
        if (
          item.product.id === productId &&
          item.selectedVariant?.id === variantId
        ) {
          return { ...item, quantity: Math.max(0, quantity) };
        }
        return item;
      });
      return { items: newItems.filter(item => item.quantity > 0) };
    });
  },

  clearCart: () => set({ items: [] }),

  getTotal: () => {
    return get().items.reduce((total, item) => {
      const variantPrice = item.selectedVariant?.priceModifier || 0;
      return total + (item.product.price + variantPrice) * item.quantity;
    }, 0);
  },

  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
}));
