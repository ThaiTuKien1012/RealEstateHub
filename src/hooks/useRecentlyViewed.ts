import { create } from 'zustand';
import { Product } from '../types';

interface RecentlyViewedStore {
  items: Product[];
  addItem: (product: Product) => void;
  clearHistory: () => void;
}

export const useRecentlyViewed = create<RecentlyViewedStore>((set, get) => ({
  items: [],

  addItem: (product) => {
    set(state => {
      const filtered = state.items.filter(item => item.id !== product.id);
      const newItems = [product, ...filtered].slice(0, 10);
      return { items: newItems };
    });
  },

  clearHistory: () => set({ items: [] }),
}));
