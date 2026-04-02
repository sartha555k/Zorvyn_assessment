import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Role, User, Toast, ToastType } from '../types';
import { v4 as uuidv4 } from 'uuid';

const ADMIN_USER: User = {
  name: 'Arjun Mehta',
  email: 'arjun@fintrack.io',
  avatar: 'AM',
  role: 'admin',
  phone: '+91 98765 43210',
  location: 'Bengaluru, India',
  timezone: 'IST',
  currency: 'INR',
  avatarInitials: 'AM',
  joinedDate: 'January 2025',
};

const VIEWER_USER: User = {
  name: 'Priya Sharma',
  email: 'priya@fintrack.io',
  avatar: 'PS',
  role: 'viewer',
  phone: '+91 98765 43210',
  location: 'Mumbai, India',
  timezone: 'IST',
  currency: 'INR',
  avatarInitials: 'PS',
  joinedDate: 'February 2025',
};

interface AuthState {
  role: Role;
  currentUser: User;
  toasts: Toast[];
  setRole: (role: Role) => void;
  switchRole: () => void;
  updateProfile: (updates: Partial<User>) => void;
  addToast: (type: ToastType, message: string) => void;
  removeToast: (id: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      role: 'admin',
      currentUser: ADMIN_USER,
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
      updateProfile: (updates) =>
        set((state) => ({
          currentUser: { ...state.currentUser, ...updates },
        })),
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
      }),
    }
  )
);
