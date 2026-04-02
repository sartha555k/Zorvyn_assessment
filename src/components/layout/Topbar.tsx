import { Search, Bell, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useFilterStore } from '../../store/useFilterStore';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';

const pageTitles: Record<string, string> = {
  '/': 'AI Insights Dashboard',
  '/transactions': 'Transactions History',
  '/insights': 'AI Insights',
  '/admin': 'Admin Dashboard',
};

export function Topbar() {
  const { currentUser, role, darkMode, toggleDarkMode, setRole, addToast } = useAuthStore();
  const { searchQuery, setSearch } = useFilterStore();
  const location = useLocation();

  const pageTitle = pageTitles[location.pathname] || 'Dashboard';

  return (
    <header className="h-16 sticky top-0 z-40 bg-[#0f1117]/80 backdrop-blur-xl border-b border-white/10 flex justify-between items-center px-4 md:px-6 w-full">
      <div className="flex items-center gap-4">
        <h1 className="text-sm md:text-base font-headline font-bold text-white hidden sm:block">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        {/* Search */}
        <div className="flex items-center bg-[#121319]/40 backdrop-blur-md border border-white/5 rounded-xl px-3 py-2 gap-2 focus-within:ring-1 focus-within:ring-[#00fd87] transition-all w-32 sm:w-48 md:w-64 focus-within:w-64 md:focus-within:w-80">
          <Search size={14} className="text-slate-500 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="bg-transparent border-none p-0 text-xs focus:ring-0 placeholder:text-slate-600 w-full text-white outline-none"
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
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#ff706f] rounded-full" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2">
          <div
            className={clsx(
              'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border',
              role === 'admin'
                ? 'bg-[#00fd87]/20 text-[#00fd87] border-[#00fd87]/20'
                : 'bg-amber-500/20 text-amber-400 border-amber-500/20'
            )}
          >
            {currentUser.avatar}
          </div>
          <span className="text-xs font-bold text-white hidden md:block">
            {currentUser.name}
          </span>
        </div>
      </div>
    </header>
  );
}
