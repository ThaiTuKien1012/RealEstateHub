import { create } from 'zustand';
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

export const useSavedFilters = create<SavedFiltersState>((set, get) => ({
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
}));
