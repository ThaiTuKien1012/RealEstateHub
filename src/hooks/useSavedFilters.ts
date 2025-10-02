import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { Filter } from '../types';

export interface SavedFilter {
  id: string;
  name: string;
  filters: Partial<Filter>;
  createdAt: string;
}

interface SavedFiltersState {
  savedFilters: SavedFilter[];
  addFilter: (name: string, filters: Partial<Filter>) => void;
  removeFilter: (id: string) => void;
  loadFilter: (id: string) => Partial<Filter> | undefined;
  clearAll: () => void;
}

const customStorage: StateStorage = {
  getItem: (name: string): string | null => {
    try {
      if (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) {
        return (globalThis as any).localStorage.getItem(name);
      }
    } catch {}
    return null;
  },
  setItem: (name: string, value: string): void => {
    try {
      if (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) {
        (globalThis as any).localStorage.setItem(name, value);
      }
    } catch {}
  },
  removeItem: (name: string): void => {
    try {
      if (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) {
        (globalThis as any).localStorage.removeItem(name);
      }
    } catch {}
  },
};

export const useSavedFilters = create<SavedFiltersState>()(
  persist(
    (set, get) => ({
      savedFilters: [],

      addFilter: (name: string, filters: Partial<Filter>) => {
        const newFilter: SavedFilter = {
          id: Date.now().toString(),
          name,
          filters,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          savedFilters: [...state.savedFilters, newFilter],
        }));
      },

      removeFilter: (id: string) => {
        set((state) => ({
          savedFilters: state.savedFilters.filter((f) => f.id !== id),
        }));
      },

      loadFilter: (id: string) => {
        const filter = get().savedFilters.find((f) => f.id === id);
        return filter?.filters;
      },

      clearAll: () => {
        set({ savedFilters: [] });
      },
    }),
    {
      name: 'saved-filters-storage',
      storage: createJSONStorage(() => customStorage),
    }
  )
);
