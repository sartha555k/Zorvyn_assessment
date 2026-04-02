import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AIState {
  provider: 'gpt' | 'gemini' | 'test' | null;
  apiKey: string | null;
  setCredentials: (provider: 'gpt' | 'gemini' | 'test', key?: string) => void;
  clearCredentials: () => void;
}

export const useAIStore = create<AIState>()(
  persist(
    (set) => ({
      provider: null,
      apiKey: null,
      setCredentials: (provider, key) => set({ provider, apiKey: key || null }),
      clearCredentials: () => set({ provider: null, apiKey: null }),
    }),
    {
      name: 'finance-ai-settings',
    }
  )
);
