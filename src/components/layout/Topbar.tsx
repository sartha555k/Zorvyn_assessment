import { Search, Bell, Sun, Moon, Menu } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useFilterStore } from '../../store/useFilterStore';
import { useThemeStore } from '../../store/useThemeStore';
import { useLocation, Link } from 'react-router-dom';
import clsx from 'clsx';

const pageTitles: Record<string, string> = {
  '/': 'AI Insights Dashboard',
  '/transactions': 'Transactions History',
  '/insights': 'AI Insights',
  '/admin': 'Admin Dashboard',
};

export function Topbar({ onOpenMobileNav }: { onOpenMobileNav?: () => void }) {
  const { currentUser, role, setRole, addToast } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { searchQuery, setSearch } = useFilterStore();
  const location = useLocation();

  const pageTitle = pageTitles[location.pathname] || 'Dashboard';

  return (
    <header className="h-16 sticky top-0 z-40 bg-white/80 dark:bg-[#0f1117]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 flex justify-between items-center px-3 md:px-6 w-full transition-colors">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onOpenMobileNav?.()}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu size={18} className="text-gray-700 dark:text-slate-200" />
        </button>

        <h1 className="text-xs sm:text-sm md:text-base font-headline font-bold text-gray-900 dark:text-white hidden sm:block">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        {/* Search */}
        <div className="flex items-center bg-gray-100 dark:bg-[#121319]/40 backdrop-blur-md border border-gray-200 dark:border-white/5 rounded-xl px-3 py-2 gap-2 focus-within:ring-1 focus-within:ring-indigo-500 dark:focus-within:ring-[#00fd87] transition-all w-32 sm:w-48 md:w-64 focus-within:w-64 md:focus-within:w-80">
          <Search size={14} className="text-gray-400 dark:text-slate-500 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="bg-transparent border-none p-0 text-xs focus:ring-0 placeholder:text-gray-400 dark:placeholder:text-slate-600 w-full text-gray-900 dark:text-white outline-none"
          />
        </div>

        {/* Role Toggle */}
        <div className="hidden lg:flex items-center bg-[#181920] rounded-full p-1 border border-white/5">
          <button
            onClick={() => { setRole('viewer'); addToast('info', 'Switched to Viewer view'); }}
            className={clsx(
              'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all',
              role === 'viewer'
                ? 'text-amber-400 bg-amber-400/10'
                : 'text-slate-500 hover:text-slate-300'
            )}
          >
            Viewer
          </button>
          <button
            onClick={() => { setRole('admin'); addToast('info', 'Switched to Admin view'); }}
            className={clsx(
              'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all',
              role === 'admin'
                ? 'text-[#00fd87] bg-[#00fd87]/10'
                : 'text-slate-500 hover:text-slate-300'
            )}
          >
            Admin
          </button>
        </div>

        {/* Dark Mode */}
        <button
          onClick={toggleTheme}
          className={clsx(
            "p-1.5 rounded-full flex items-center justify-center transition-all duration-300",
            theme === 'light' 
              ? "bg-white text-amber-500 hover:bg-gray-100 border border-gray-200" 
              : "bg-slate-700 text-indigo-400 hover:bg-slate-600 border border-slate-600"
          )}
          title="Toggle theme"
        >
          {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-white/5 dark:text-slate-400 dark:hover:text-white transition-colors">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#ff706f] rounded-full" />
        </button>

        {/* User Avatar */}
        <Link 
          to="/profile" 
          className="flex items-center gap-2 hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2 hover:ring-offset-white dark:hover:ring-offset-[#0f1117] rounded-full transition-all cursor-pointer outline-none"
          title="View Profile"
        >
          <div
            className={clsx(
              'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border',
              role === 'admin'
                ? 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-400 dark:border-indigo-500/20'
                : 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-400 dark:border-amber-500/20'
            )}
          >
            {currentUser.avatarInitials || currentUser.avatar}
          </div>
          <span className="text-xs font-bold text-gray-900 dark:text-white hidden md:block">
            {currentUser.name}
          </span>
        </Link>
      </div>
    </header>
  );
}
