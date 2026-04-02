import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction } from '../types';
import { mockTransactions } from '../data/mockTransactions';

interface TransactionState {
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  updateTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  bulkDelete: (ids: string[]) => void;
  importTransactions: (txs: Transaction[]) => void;
  resetToDemo: () => void;
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set) => ({
      transactions: mockTransactions,
      addTransaction: (tx) =>
        set((state) => ({ transactions: [tx, ...state.transactions] })),
      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),
      bulkDelete: (ids) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => !ids.includes(t.id)),
        })),
      importTransactions: (txs) =>
        set((state) => ({
          transactions: [...state.transactions, ...txs],
        })),
      resetToDemo: () => set({ transactions: mockTransactions }),
    }),
    {
      name: 'finance-transactions',
    }
  )
);
