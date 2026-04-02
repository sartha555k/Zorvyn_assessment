import { useMemo } from 'react';
import { Transaction } from '../types';
import { useFilterStore } from '../store/useFilterStore';
import { parseISO } from 'date-fns';

export function useFilters(transactions: Transaction[]) {
  const {
    searchQuery,
    selectedCategories,
    dateRange,
    selectedType,
    sortField,
    sortDirection,
  } = useFilterStore();

  return useMemo(() => {
    let filtered = [...transactions];

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.merchant.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((t) =>
        selectedCategories.includes(t.category)
      );
    }

    // Date range filter
    if (dateRange.from) {
      filtered = filtered.filter(
        (t) => parseISO(t.date) >= parseISO(dateRange.from)
      );
    }
    if (dateRange.to) {
      filtered = filtered.filter(
        (t) => parseISO(t.date) <= parseISO(dateRange.to)
      );
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter((t) => t.type === selectedType);
    }

    // Sort
    filtered.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'date') {
        cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortField === 'amount') {
        cmp = Math.abs(a.amount) - Math.abs(b.amount);
      } else if (sortField === 'category') {
        cmp = a.category.localeCompare(b.category);
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });

    const totalIncome = filtered
      .filter((t) => t.type === 'income')
      .reduce((s, t) => s + t.amount, 0);
    const totalExpenses = filtered
      .filter((t) => t.type === 'expense')
      .reduce((s, t) => s + Math.abs(t.amount), 0);
    const netAmount = totalIncome - totalExpenses;

    return {
      filteredTransactions: filtered,
      totalIncome,
      totalExpenses,
      netAmount,
    };
  }, [
    transactions,
    searchQuery,
    selectedCategories,
    dateRange,
    selectedType,
    sortField,
    sortDirection,
  ]);
}
