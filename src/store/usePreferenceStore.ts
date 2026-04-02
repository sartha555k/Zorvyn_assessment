import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface PreferenceState {
  defaultMonthView: 'current' | 'last' | 'last3' | 'last6';
  compactMode: boolean;
  showCurrencyDecimals: boolean;
  notifications: {
    monthlySummary: boolean;
    budgetAlerts: boolean;
    largeTransactions: boolean;
    weeklyDigest: boolean;
  };
  setDefaultMonthView: (v: PreferenceState['defaultMonthView']) => void;
  setCompactMode: (v: boolean) => void;
  setShowCurrencyDecimals: (v: boolean) => void;
  setNotification: (key: keyof PreferenceState['notifications'], value: boolean) => void;
}

export const usePreferenceStore = create<PreferenceState>()(
  persist(
    (set) => ({
      defaultMonthView: 'current',
      compactMode: false,
      showCurrencyDecimals: true,
      notifications: {
        monthlySummary: true,
        budgetAlerts: true,
        largeTransactions: false,
        weeklyDigest: false,
      },
      setDefaultMonthView: (v) => set({ defaultMonthView: v }),
      setCompactMode: (v) => set({ compactMode: v }),
      setShowCurrencyDecimals: (v) => set({ showCurrencyDecimals: v }),
      setNotification: (key, value) =>
        set((state) => ({
          notifications: { ...state.notifications, [key]: value },
        })),
    }),
    {
      name: 'finance-preferences',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
