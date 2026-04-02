import { create } from 'zustand';
import { Category } from '../types';

interface FilterState {
  searchQuery: string;
  selectedCategories: Category[];
  dateRange: { from: string; to: string };
  selectedType: 'all' | 'income' | 'expense';
  sortField: 'date' | 'amount' | 'category';
  sortDirection: 'asc' | 'desc';
  activeMonth: string; // format: 'YYYY-MM'
  setSearch: (query: string) => void;
  setCategories: (cats: Category[]) => void;
  setDateRange: (range: { from: string; to: string }) => void;
  setType: (type: 'all' | 'income' | 'expense') => void;
  setSort: (field: 'date' | 'amount' | 'category') => void;
  setActiveMonth: (month: string) => void;
  resetFilters: () => void;
}

const defaultState = {
  searchQuery: '',
  selectedCategories: [] as Category[],
  dateRange: { from: '', to: '' },
  selectedType: 'all' as const,
  sortField: 'date' as const,
  sortDirection: 'desc' as const,
  activeMonth: '2025-06',
};

export const useFilterStore = create<FilterState>()((set, get) => ({
  ...defaultState,
  setSearch: (query) => set({ searchQuery: query }),
  setCategories: (cats) => set({ selectedCategories: cats }),
  setDateRange: (range) => set({ dateRange: range }),
  setType: (type) => set({ selectedType: type }),
  setSort: (field) =>
    set((state) => ({
      sortField: field,
      sortDirection:
        state.sortField === field && state.sortDirection === 'desc'
          ? 'asc'
          : 'desc',
    })),
  setActiveMonth: (month) => set({ activeMonth: month }),
  resetFilters: () => set(defaultState),
}));
