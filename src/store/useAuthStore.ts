import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Role, User, Toast, ToastType } from '../types';
import { v4 as uuidv4 } from 'uuid';

const ADMIN_USER: User = {
  name: 'Arjun Mehta',
  email: 'arjun@fintrack.io',
  avatar: 'AM',
  role: 'admin',
};

const VIEWER_USER: User = {
  name: 'Priya Sharma',
  email: 'priya@fintrack.io',
  avatar: 'PS',
  role: 'viewer',
};

interface AuthState {
  role: Role;
  currentUser: User;
  darkMode: boolean;
  toasts: Toast[];
  setRole: (role: Role) => void;
  switchRole: () => void;
  toggleDarkMode: () => void;
  addToast: (type: ToastType, message: string) => void;
  removeToast: (id: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      role: 'admin',
      currentUser: ADMIN_USER,
      darkMode: true,
      toasts: [],
      setRole: (role) =>
        set({
          role,
          currentUser: role === 'admin' ? ADMIN_USER : VIEWER_USER,
        }),
      switchRole: () => {
        const newRole = get().role === 'admin' ? 'viewer' : 'admin';
        set({
          role: newRole,
          currentUser: newRole === 'admin' ? ADMIN_USER : VIEWER_USER,
        });
      },
      toggleDarkMode: () => {
        const newMode = !get().darkMode;
        set({ darkMode: newMode });
        if (newMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      addToast: (type, message) => {
        const toast: Toast = { id: uuidv4(), type, message };
        set((state) => ({ toasts: [...state.toasts, toast] }));
        setTimeout(() => {
          set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== toast.id),
          }));
        }, 3000);
      },
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),
    }),
    {
      name: 'finance-auth',
      partialize: (state) => ({
        role: state.role,
        currentUser: state.currentUser,
        darkMode: state.darkMode,
      }),
    }
  )
);
