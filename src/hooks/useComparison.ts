import { create } from 'zustand';
import { Product } from '../types';

interface ComparisonState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearAll: () => void;
  isInComparison: (productId: string) => boolean;
}

export const useComparison = create<ComparisonState>((set, get) => ({
  items: [],
  
  addItem: (product) => {
    const { items } = get();
    if (items.length >= 3) {
      return;
    }
    if (!items.find(item => item.id === product.id)) {
      set({ items: [...items, product] });
    }
  },
  
  removeItem: (productId) => {
    set({ items: get().items.filter(item => item.id !== productId) });
  },
  
  clearAll: () => {
    set({ items: [] });
  },
  
  isInComparison: (productId) => {
    return get().items.some(item => item.id === productId);
  },
}));
