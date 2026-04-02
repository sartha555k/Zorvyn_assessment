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
  success: 'border-[#00fd87] bg-[#00fd87]/10 text-[#00fd87]',
  error: 'border-[#ff706f] bg-[#ff706f]/10 text-[#ff706f]',
  warning: 'border-amber-400 bg-amber-400/10 text-amber-400',
  info: 'border-[#5bb1ff] bg-[#5bb1ff]/10 text-[#5bb1ff]',
};

export function Layout() {
  const { toasts, removeToast } = useAuthStore();

  return (
    <div className="min-h-screen bg-[#0d0e13] text-[#f7f5fd]">
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
                'shadow-2xl animate-slide-in-right',
                toastColors[toast.type],
                'bg-[#121319]/90'
              )}
            >
              <Icon size={16} />
              <p className="text-sm font-medium flex-1 text-white">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-0.5 hover:bg-white/10 rounded transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
