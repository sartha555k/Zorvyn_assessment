import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { useTransactionStore } from '../store/useTransactionStore';
import { usePreferenceStore } from '../store/usePreferenceStore';
import { formatCurrency } from '../utils/formatCurrency';
import { exportCSV, exportJSON } from '../utils/exportData';
import {
  UserCircle, Palette, Bell, Shield, Settings, Check, Edit2, X, Shield as ShieldIcon, Eye, Sun, Moon
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import clsx from 'clsx';

export function ProfilePage() {
  const { currentUser, role, setRole, updateProfile, addToast } = useAuthStore();
  const { theme, setTheme, toggleTheme } = useThemeStore();
  const { transactions, resetToDemo } = useTransactionStore();
  const preferences = usePreferenceStore();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState(currentUser);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    setProfileForm(currentUser);
  }, [currentUser]);

  // Quick stats
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0);
  const netBalance = totalIncome - totalExpenses;

  const handleSaveProfile = () => {
    updateProfile(profileForm);
    setIsEditingProfile(false);
    addToast('success', 'Profile updated successfully');
  };

  const handleRoleSwitch = (newRole: 'admin' | 'viewer') => {
    setRole(newRole);
    addToast('success', `Role switched to ${newRole}`);
  };

  return (
    <section className="p-2 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
        
        {/* LEFT COLUMN - Sticky Profile Card */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <div className="sticky top-8 space-y-6">
            <Card className="p-6 text-center shadow-sm dark:shadow-slate-900/50 transition-all">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-md">
                {currentUser.avatarInitials || currentUser.avatar}
              </div>
              <h2 className="text-xl font-headline font-bold text-gray-900 dark:text-slate-100">
                {currentUser.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-2">{currentUser.email}</p>
              
              <div className="flex justify-center mb-1">
                <span className={clsx(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                  role === 'admin' ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                )}>
                  {role}
                </span>
              </div>
              <p className="text-xs text-gray-400 dark:text-slate-500">Member since {currentUser.joinedDate || 'January 2025'}</p>
              
              <div className="my-6 border-b border-gray-100 dark:border-slate-700"></div>
              
              <div className="space-y-4 text-left">
                <div className="pl-3 border-l-2 border-slate-300 dark:border-slate-600">
                  <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-widest font-label mb-1">Total Transactions</p>
                  <p className="text-lg font-mono font-bold text-gray-900 dark:text-slate-100">{transactions.length}</p>
                </div>
                <div className="pl-3 border-l-2 border-emerald-400 dark:border-emerald-500">
                  <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-widest font-label mb-1">Total Income</p>
                  <p className="text-lg font-mono font-bold text-gray-900 dark:text-slate-100">{formatCurrency(totalIncome)}</p>
                </div>
                <div className="pl-3 border-l-2 border-rose-400 dark:border-rose-500">
                  <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-widest font-label mb-1">Total Expenses</p>
                  <p className="text-lg font-mono font-bold text-gray-900 dark:text-slate-100">{formatCurrency(totalExpenses)}</p>
                </div>
                <div className={clsx("pl-3 border-l-2", netBalance >= 0 ? "border-emerald-500" : "border-rose-500")}>
                  <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-widest font-label mb-1">Net Balance</p>
                  <p className={clsx("text-lg font-mono font-bold", netBalance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400")}>
                    {formatCurrency(netBalance)}
                  </p>
                </div>
              </div>
              
              <div className="my-6 border-b border-gray-100 dark:border-slate-700"></div>
              
              <div className="text-left">
                <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-widest font-label mb-3">Active Role</p>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => handleRoleSwitch('admin')}
                    className={clsx(
                      "p-3 rounded-xl border text-left transition-all duration-200",
                      role === 'admin' 
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" 
                        : "border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldIcon size={16} className={role === 'admin' ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 dark:text-slate-500"} />
                      <span className={clsx("font-bold text-sm", role === 'admin' ? "text-indigo-900 dark:text-indigo-100" : "text-gray-700 dark:text-slate-300")}>Admin</span>
                    </div>
                    <p className={clsx("text-xs mt-1", role === 'admin' ? "text-indigo-600/70 dark:text-indigo-400/70" : "text-gray-400 dark:text-slate-500")}>Full access</p>
                  </button>
                  <button 
                    onClick={() => handleRoleSwitch('viewer')}
                    className={clsx(
                      "p-3 rounded-xl border text-left transition-all duration-200",
                      role === 'viewer' 
                        ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20" 
                        : "border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Eye size={16} className={role === 'viewer' ? "text-amber-600 dark:text-amber-400" : "text-gray-400 dark:text-slate-500"} />
                      <span className={clsx("font-bold text-sm", role === 'viewer' ? "text-amber-900 dark:text-amber-100" : "text-gray-700 dark:text-slate-300")}>Viewer</span>
                    </div>
                    <p className={clsx("text-xs mt-1", role === 'viewer' ? "text-amber-600/70 dark:text-amber-400/70" : "text-gray-400 dark:text-slate-500")}>Read only</p>
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full md:w-2/3 lg:w-3/4 space-y-6">
          
          {/* Section 1: Personal Information */}
          <Card className="p-6 transition-all duration-300 shadow-sm dark:shadow-slate-900/50" style={{ animationDelay: '50ms', animationFillMode: 'both' }}>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <UserCircle className="text-indigo-500" />
                <h3 className="font-headline font-bold text-gray-900 dark:text-slate-100">Personal Information</h3>
              </div>
              {!isEditingProfile && (
                <Button variant="ghost" size="sm" onClick={() => setIsEditingProfile(true)}>
                  <Edit2 size={14} className="mr-1" /> Edit
                </Button>
              )}
            </div>

            {isEditingProfile ? (
              <div className="animate-fade-in space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Full Name" value={profileForm.name || ''} onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} />
                  <Input label="Email Address" type="email" value={profileForm.email || ''} onChange={(e) => setProfileForm({...profileForm, email: e.target.value})} />
                  <Input label="Phone Number" placeholder="+91 XXXXX XXXXX" value={profileForm.phone || ''} onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})} />
                  <Input label="Location" placeholder="Bengaluru, India" value={profileForm.location || ''} onChange={(e) => setProfileForm({...profileForm, location: e.target.value})} />
                  <Select 
                    label="Timezone" 
                    value={profileForm.timezone || 'IST'} 
                    onChange={(e) => setProfileForm({...profileForm, timezone: e.target.value})}
                    options={[ {value: 'IST', label: 'IST'}, {value: 'UTC', label: 'UTC'}, {value: 'EST', label: 'EST'}, {value: 'PST', label: 'PST'}, {value: 'GMT', label: 'GMT'} ]}
                  />
                  <Select 
                    label="Currency Preference" 
                    value={profileForm.currency || 'INR'} 
                    onChange={(e) => setProfileForm({...profileForm, currency: e.target.value})}
                    options={[ {value: 'INR', label: 'INR ₹'}, {value: 'USD', label: 'USD $'}, {value: 'EUR', label: 'EUR €'}, {value: 'GBP', label: 'GBP £'} ]}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="ghost" onClick={() => { setProfileForm(currentUser); setIsEditingProfile(false); }}>Cancel</Button>
                  <Button onClick={handleSaveProfile}>Save Changes</Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4 animate-fade-in">
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-widest font-label mb-1">Full Name</p>
                  <p className="text-gray-900 dark:text-slate-100 font-medium">{currentUser.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-widest font-label mb-1">Email Address</p>
                  <p className="text-gray-900 dark:text-slate-100 font-medium">{currentUser.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-widest font-label mb-1">Phone Number</p>
                  <p className="text-gray-900 dark:text-slate-100 font-medium">{currentUser.phone || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-widest font-label mb-1">Location</p>
                  <p className="text-gray-900 dark:text-slate-100 font-medium">{currentUser.location || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-widest font-label mb-1">Timezone</p>
                  <p className="text-gray-900 dark:text-slate-100 font-medium">{currentUser.timezone || 'IST'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-widest font-label mb-1">Currency</p>
                  <p className="text-gray-900 dark:text-slate-100 font-medium">{currentUser.currency || 'INR'}</p>
                </div>
              </div>
            )}
          </Card>

          {/* Section 2: Appearance & Preferences */}
          <Card className="p-6 transition-all duration-300 shadow-sm dark:shadow-slate-900/50" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
            <div className="flex items-center gap-3 mb-6">
              <Palette className="text-indigo-500" />
              <h3 className="font-headline font-bold text-gray-900 dark:text-slate-100">Appearance & Preferences</h3>
            </div>
            
            <div className="space-y-6 divide-y divide-gray-100 dark:divide-slate-700">
              
              {/* Theme Toggle Row */}
              <div className="py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4 first:pt-0">
                <div>
                  <p className="text-gray-900 dark:text-slate-100 font-medium mb-1">Color Theme</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Choose your preferred interface theme</p>
                </div>
                <div className="flex bg-gray-100 dark:bg-slate-900 p-1 rounded-full shrink-0 items-center justify-between shadow-inner">
                  <button 
                    onClick={() => setTheme('light')}
                    className={clsx(
                      "flex items-center gap-2 px-4 py-1.5 rounded-full transition-all duration-200 text-sm font-medium",
                      theme === 'light' ? "bg-white shadow-sm text-amber-500 scale-[1.02]" : "text-gray-500 hover:text-gray-700 dark:hover:text-amber-100"
                    )}
                  >
                    <Sun size={14} /> Light
                  </button>
                  <button 
                    onClick={() => setTheme('dark')}
                    className={clsx(
                      "flex items-center gap-2 px-4 py-1.5 rounded-full transition-all duration-200 text-sm font-medium",
                      theme === 'dark' ? "bg-slate-700 shadow-sm text-indigo-400 scale-[1.02]" : "text-gray-500 hover:text-gray-700 dark:hover:text-indigo-200"
                    )}
                  >
                    <Moon size={14} /> Dark
                  </button>
                </div>
              </div>

              {/* Default Month View */}
              <div className="py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <p className="text-gray-900 dark:text-slate-100 font-medium mb-1">Default Month View</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">What time range to show by default</p>
                </div>
                <div className="w-48 shrink-0">
                  <Select 
                    value={preferences.defaultMonthView}
                    onChange={(e) => {
                      preferences.setDefaultMonthView(e.target.value as any);
                      addToast('success', 'Preference saved');
                    }}
                    options={[
                      {value: 'current', label: 'Current Month'},
                      {value: 'last', label: 'Last Month'},
                      {value: 'last3', label: 'Last 3 Months'},
                      {value: 'last6', label: 'Last 6 Months'}
                    ]}
                  />
                </div>
              </div>

              {/* Compact Mode */}
              <div className="py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <p className="text-gray-900 dark:text-slate-100 font-medium mb-1">Compact Table View</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Show more rows with reduced padding</p>
                </div>
                <button
                  onClick={() => {
                    preferences.setCompactMode(!preferences.compactMode);
                    addToast('success', 'Preference saved');
                  }}
                  className={clsx(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2",
                    preferences.compactMode ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-slate-600'
                  )}
                >
                  <span
                    className={clsx(
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      preferences.compactMode ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>

            </div>
          </Card>

          {/* Section 3: Notification Preferences */}
          <Card className="p-6 transition-all duration-300 shadow-sm dark:shadow-slate-900/50" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
            <div className="flex items-center gap-3 mb-6">
              <Bell className="text-indigo-500" />
              <h3 className="font-headline font-bold text-gray-900 dark:text-slate-100">Notification Preferences</h3>
            </div>
            
            <div className="space-y-6 divide-y divide-gray-100 dark:divide-slate-700">
              {[
                { id: 'monthlySummary', title: 'Monthly Summary', desc: 'Get a summary at the end of each month' },
                { id: 'budgetAlerts', title: 'Budget Alerts', desc: 'Alert when spending exceeds category budget' },
                { id: 'largeTransactions', title: 'Large Transactions', desc: 'Flag transactions above ₹10,000' },
                { id: 'weeklyDigest', title: 'Weekly Digest', desc: 'Weekly spending report' },
              ].map(item => (
                <div key={item.id} className="py-4 flex justify-between items-center gap-4 first:pt-0">
                  <div>
                    <p className="text-gray-900 dark:text-slate-100 font-medium mb-1">{item.title}</p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => {
                      preferences.setNotification(item.id as keyof typeof preferences.notifications, !(preferences.notifications as any)[item.id]);
                      addToast('success', 'Notification preferences saved');
                    }}
                    className={clsx(
                      "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2",
                      (preferences.notifications as any)[item.id] ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-slate-600'
                    )}
                  >
                    <span
                      className={clsx(
                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                        (preferences.notifications as any)[item.id] ? 'translate-x-5' : 'translate-x-0'
                      )}
                    />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Section 4: Data & Privacy */}
          <Card className="p-6 transition-all duration-300 shadow-sm dark:shadow-slate-900/50" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
            <div className="flex items-center gap-3 mb-6">
              <Shield className="text-indigo-500" />
              <h3 className="font-headline font-bold text-gray-900 dark:text-slate-100">Data & Privacy</h3>
            </div>
            
            <div className="space-y-6 divide-y divide-gray-100 dark:divide-slate-700">
              <div className="py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4 first:pt-0">
                <div>
                  <p className="text-gray-900 dark:text-slate-100 font-medium mb-1">Export My Data</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Download all your transaction data</p>
                </div>
                <div className="flex gap-2 shrink-0">
                   <Button variant="ghost" size="sm" onClick={() => { exportCSV(transactions, 'my-data'); addToast('success', 'CSV Exported'); }}>CSV</Button>
                   <Button variant="ghost" size="sm" onClick={() => { exportJSON(transactions, 'my-data'); addToast('success', 'JSON Exported'); }}>JSON</Button>
                </div>
              </div>

              <div className="py-4 flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <p className="text-gray-900 dark:text-slate-100 font-medium mb-1">Reset Dashboard</p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">Reset to original demo data (cannot be undone)</p>
                  </div>
                  <Button variant="danger" onClick={() => setShowResetConfirm(true)}>Reset Data</Button>
                </div>
                
                <div className={clsx("overflow-hidden transition-all duration-300", showResetConfirm ? "max-h-80 opacity-100" : "max-h-0 opacity-0")}>
                  <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <p className="text-sm text-rose-700 dark:text-rose-300 font-medium">Are you sure? This will delete all your transactions and restore demo data.</p>
                    <div className="flex gap-2 shrink-0">
                      <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" onClick={() => setShowResetConfirm(false)}>Cancel</Button>
                      <Button variant="danger" size="sm" onClick={() => { resetToDemo(); setShowResetConfirm(false); addToast('warning', 'Dashboard reset to demo data'); }}>Confirm Reset</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 5: Account Info */}
          <Card className="p-6 transition-all duration-300 shadow-sm dark:shadow-slate-900/50" style={{ animationDelay: '250ms', animationFillMode: 'both' }}>
            <div className="flex items-center gap-3 mb-6">
              <Settings className="text-indigo-500" />
              <h3 className="font-headline font-bold text-gray-900 dark:text-slate-100">Account</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 dark:text-slate-400">Current Session</span>
                <span className="text-gray-900 dark:text-slate-100 font-medium capitalize">{role} access since {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 dark:text-slate-400">App Version</span>
                <span className="text-gray-900 dark:text-slate-100 font-medium font-mono">FinTrack v1.0.0</span>
              </div>
            </div>
          </Card>

          <div className="py-6 text-center text-xs text-gray-400 dark:text-slate-500">
             Made with ♥ for evaluation
          </div>

        </div>
      </div>
    </section>
  );
}
