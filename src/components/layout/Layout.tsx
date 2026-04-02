import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useAuthStore } from '../../store/useAuthStore';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const toastColors = {
  success: 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700 text-emerald-800 dark:text-emerald-400',
  error: 'bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-700 text-rose-800 dark:text-rose-400',
  warning: 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-400',
  info: 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700 text-indigo-800 dark:text-indigo-400',
};

export function Layout() {
  const { toasts, removeToast } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors">
      {/* Ambient Background */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#a4ffb9]/[0.04] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#5bb1ff]/[0.03] blur-[100px]" />
      </div>

      <Sidebar />

      <div className="md:ml-[72px] min-h-screen flex flex-col relative z-10">
        <Topbar />
        <main className="flex-1 pb-24 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Toast Container */}
      <div className="fixed top-20 right-4 z-[200] space-y-2 max-w-sm">
        {toasts.map((toast) => {
          const Icon = toastIcons[toast.type];
          return (
            <div
              key={toast.id}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl',
                'shadow-lg animate-slide-in-right',
                toastColors[toast.type]
              )}
            >
              <Icon size={16} />
              <p className="text-sm font-medium flex-1 text-gray-900 dark:text-slate-100">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-0.5 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors"
              >
                <X size={14} className="text-gray-500 dark:text-slate-400" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
