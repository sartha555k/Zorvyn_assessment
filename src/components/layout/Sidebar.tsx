import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, BarChart3, Shield, Zap, ChevronDown, UserCircle, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useState } from 'react';
import clsx from 'clsx';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', adminOnly: false },
  { to: '/transactions', icon: Receipt, label: 'Transactions', adminOnly: false },
  { to: '/insights', icon: BarChart3, label: 'Insights', adminOnly: false },
  { to: '/ai-insights', icon: Sparkles, label: 'AI Assistant', adminOnly: false },
  { to: '/admin', icon: Shield, label: 'Admin', adminOnly: true },
  { to: '/profile', icon: UserCircle, label: 'Profile', adminOnly: false },
];

export function Sidebar({
  isMobileNavOpen,
  onCloseMobileNav,
}: {
  isMobileNavOpen: boolean;
  onCloseMobileNav: () => void;
}) {
  const { role, currentUser, setRole, addToast } = useAuthStore();
  const [showRolePicker, setShowRolePicker] = useState(false);

  const handleRoleSwitch = (newRole: 'admin' | 'viewer') => {
    setRole(newRole);
    setShowRolePicker(false);
    addToast('info', `Switched to ${newRole === 'admin' ? 'Admin' : 'Viewer'} view`);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 h-screen transition-all duration-500 w-[72px] hover:w-[220px] overflow-hidden bg-[#0d0e13] flex-col py-6 z-50 shadow-[20px_0_40px_-10px_rgba(0,255,136,0.08)] group hidden md:flex">
        {/* Logo */}
        <div className="px-6 mb-10 flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-[#00fd87] flex items-center justify-center shrink-0">
            <Zap size={18} className="text-[#005b2c]" fill="currentColor" />
          </div>
          <span className="font-headline font-black text-xl tracking-wide text-[#00fd87] opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            FinTrack
          </span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            if (item.adminOnly && role !== 'admin') return null;
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center h-12 px-6 transition-all duration-200',
                    isActive
                      ? 'border-l-[3px] border-[#00fd87] bg-[#121319] text-[#00fd87]'
                      : 'border-l-[3px] border-transparent text-slate-400 hover:text-white hover:bg-white/5'
                  )
                }
              >
                <Icon size={20} className="shrink-0" />
                <span className="ml-4 font-headline font-bold tracking-wide text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {/* Role Switcher */}
        <div className="px-4 mt-auto relative">
          <button
            onClick={() => setShowRolePicker(!showRolePicker)}
            className="flex items-center gap-3 w-full px-2 py-3 rounded-xl hover:bg-white/5 transition-colors"
          >
            <div
              className={clsx(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                role === 'admin'
                  ? 'bg-[#00fd87]/20 text-[#00fd87]'
                  : 'bg-amber-500/20 text-amber-400'
              )}
            >
              {currentUser.avatar}
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-left flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500 capitalize">{role}</p>
            </div>
            <ChevronDown size={14} className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </button>

          {showRolePicker && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-[#1e1f26] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-[60]">
              <button
                onClick={() => handleRoleSwitch('admin')}
                className={clsx(
                  'flex items-center gap-3 w-full px-4 py-3 hover:bg-white/5 transition-colors',
                  role === 'admin' && 'bg-[#00fd87]/5'
                )}
              >
                <div className="w-7 h-7 rounded-full bg-[#00fd87]/20 text-[#00fd87] flex items-center justify-center text-[10px] font-bold">
                  AM
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-white">Arjun Mehta</p>
                  <p className="text-[10px] text-[#00fd87]">Admin</p>
                </div>
              </button>
              <button
                onClick={() => handleRoleSwitch('viewer')}
                className={clsx(
                  'flex items-center gap-3 w-full px-4 py-3 hover:bg-white/5 transition-colors',
                  role === 'viewer' && 'bg-amber-500/5'
                )}
              >
                <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">
                  PS
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-white">Priya Sharma</p>
                  <p className="text-[10px] text-amber-400">Viewer</p>
                </div>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Left Drawer Nav */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-[39] md:hidden">
          {/* Backdrop (click-to-close) */}
          <div
            className="absolute left-0 right-0 top-16 bottom-0 bg-black/50 backdrop-blur-sm"
            onClick={onCloseMobileNav}
          />

          {/* Drawer Panel */}
          <aside className="absolute left-0 top-16 bottom-0 w-[280px] bg-[#0d0e13] border-r border-[#00fd87]/20 flex-col py-6 shadow-[20px_0_40px_-10px_rgba(0,255,136,0.08)] animate-slide-in-left overflow-hidden">
            {/* Logo */}
            <div className="px-6 mb-10 flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-[#00fd87] flex items-center justify-center shrink-0">
                <Zap size={18} className="text-[#005b2c]" fill="currentColor" />
              </div>
              <span className="font-headline font-black text-xl tracking-wide text-[#00fd87] whitespace-nowrap">
                FinTrack
              </span>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 space-y-1 px-1">
              {navItems
                .filter((item) => !item.adminOnly || role === 'admin')
                .map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => {
                        setShowRolePicker(false);
                        onCloseMobileNav();
                      }}
                      className={({ isActive }) =>
                        clsx(
                          'flex items-center h-12 px-4 transition-all duration-200 rounded-r-2xl',
                          isActive
                            ? 'border-l-[3px] border-[#00fd87] bg-[#121319] text-[#00fd87]'
                            : 'border-l-[3px] border-transparent text-slate-400 hover:text-white hover:bg-white/5'
                        )
                      }
                    >
                      <Icon size={20} className="shrink-0" />
                      <span className="ml-4 font-headline font-bold tracking-wide text-sm whitespace-nowrap">
                        {item.label}
                      </span>
                    </NavLink>
                  );
                })}
            </nav>

            {/* Role Switcher */}
            <div className="px-4 mt-auto relative">
              <button
                onClick={() => setShowRolePicker(!showRolePicker)}
                className="flex items-center gap-3 w-full px-2 py-3 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div
                  className={clsx(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                    role === 'admin'
                      ? 'bg-[#00fd87]/20 text-[#00fd87]'
                      : 'bg-amber-500/20 text-amber-400'
                  )}
                >
                  {currentUser.avatar}
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-500 capitalize truncate">{role}</p>
                </div>
                <ChevronDown size={14} className="text-slate-500 shrink-0" />
              </button>

              {showRolePicker && (
                <div className="absolute bottom-full left-4 right-4 mb-2 bg-[#1e1f26] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-[60]">
                  <button
                    onClick={() => handleRoleSwitch('admin')}
                    className={clsx(
                      'flex items-center gap-3 w-full px-4 py-3 hover:bg-white/5 transition-colors',
                      role === 'admin' && 'bg-[#00fd87]/5'
                    )}
                  >
                    <div className="w-7 h-7 rounded-full bg-[#00fd87]/20 text-[#00fd87] flex items-center justify-center text-[10px] font-bold">
                      AM
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-white">Arjun Mehta</p>
                      <p className="text-[10px] text-[#00fd87]">Admin</p>
                    </div>
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('viewer')}
                    className={clsx(
                      'flex items-center gap-3 w-full px-4 py-3 hover:bg-white/5 transition-colors',
                      role === 'viewer' && 'bg-amber-500/5'
                    )}
                  >
                    <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">
                      PS
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-white">Priya Sharma</p>
                      <p className="text-[10px] text-amber-400">Viewer</p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
