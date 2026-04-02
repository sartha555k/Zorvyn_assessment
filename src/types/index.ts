export type Category =
  | 'Food & Dining'
  | 'Shopping'
  | 'Transport'
  | 'Entertainment'
  | 'Healthcare'
  | 'Utilities'
  | 'Salary'
  | 'Freelance'
  | 'Rent'
  | 'Travel'
  | 'Subscriptions'
  | 'Investments'
  | 'Other';

export type PaymentMethod = 'card' | 'cash' | 'bank_transfer' | 'upi';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: Category;
  type: 'income' | 'expense';
  merchant: string;
  paymentMethod: PaymentMethod;
  tags: string[];
  note?: string;
}

export type Role = 'admin' | 'viewer';

export interface User {
  name: string;
  email: string;
  avatar: string;
  role: Role;
}

export interface InsightBiggestExpense {
  category: string;
  totalAmount: number;
  percentage: number;
  transactions: Transaction[];
}

export interface InsightMoMChange {
  current: number;
  previous: number;
  changePercent: number;
  trend: 'up' | 'down';
  categoryBreakdown: { category: string; current: number; previous: number }[];
}

export interface InsightTopCategory {
  name: string;
  totalSpend: number;
  count: number;
  avgAmount: number;
  monthlyTrend: { month: string; amount: number }[];
}

export interface DailyFlow {
  day: number;
  income: number;
  expense: number;
  cumulative: number;
}

export interface CategoryBudget {
  category: string;
  budget: number;
  actual: number;
  variance: number;
  status: 'over' | 'under' | 'on_track';
}

export interface DeepDiveInsight {
  dailyFlow: DailyFlow[];
  categoryBudgetMap: CategoryBudget[];
  keyObservations: string[];
  projectedBalance: number;
  totalFlow: number;
  netSavings: number;
  burnRate: number;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

export const CATEGORY_COLORS: Record<Category, string> = {
  'Food & Dining': '#f97316',
  'Shopping': '#ec4899',
  'Transport': '#3b82f6',
  'Entertainment': '#a855f7',
  'Healthcare': '#22c55e',
  'Utilities': '#64748b',
  'Salary': '#10b981',
  'Freelance': '#14b8a6',
  'Rent': '#ef4444',
  'Travel': '#06b6d4',
  'Subscriptions': '#8b5cf6',
  'Investments': '#84cc16',
  'Other': '#6b7280',
};

export const CATEGORIES: Category[] = [
  'Food & Dining', 'Shopping', 'Transport', 'Entertainment',
  'Healthcare', 'Utilities', 'Salary', 'Freelance', 'Rent',
  'Travel', 'Subscriptions', 'Investments', 'Other',
];
