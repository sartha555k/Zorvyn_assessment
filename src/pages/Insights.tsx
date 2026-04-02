import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ComposedChart, Area, Line, Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, ExternalLink, ChevronDown, ChevronUp, Sparkles, Lightbulb, Target } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useTransactionStore } from '../store/useTransactionStore';
import { useFilterStore } from '../store/useFilterStore';
import { useInsights } from '../hooks/useInsights';
import { formatCurrency } from '../utils/formatCurrency';
import { CATEGORY_COLORS, Category } from '../types';
import { format, subMonths, parseISO } from 'date-fns';
import clsx from 'clsx';

const months = Array.from({ length: 6 }, (_, i) => {
  const d = subMonths(new Date(2025, 5, 1), 5 - i);
  return { value: format(d, 'yyyy-MM'), label: format(d, 'MMM yyyy') };
});

export function Insights() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { transactions } = useTransactionStore();
  const { activeMonth, setActiveMonth } = useFilterStore();
  const { biggestExpense, momChange, topCategory, deepDive } = useInsights(transactions, activeMonth);

  const [biggestModal, setBiggestModal] = useState(false);
  const [momModal, setMomModal] = useState(false);
  const [topModal, setTopModal] = useState(false);
  const [deepDiveOpen, setDeepDiveOpen] = useState(false);
  const [budgetEditing, setBudgetEditing] = useState<string | null>(null);
  const [budgetValue, setBudgetValue] = useState('');

  // Handle URL params opening modals
  useEffect(() => {
    const modal = searchParams.get('modal');
    if (modal === 'biggest') setBiggestModal(true);
    if (modal === 'mom') setMomModal(true);
    if (modal === 'top') setTopModal(true);
    if (modal) setSearchParams({});
  }, [searchParams, setSearchParams]);

  const saveBudget = (category: string) => {
    const stored = JSON.parse(localStorage.getItem('finance-budgets') || '{}');
    stored[category] = Number(budgetValue);
    localStorage.setItem('finance-budgets', JSON.stringify(stored));
    setBudgetEditing(null);
  };

  // Previous month comparison data for biggest expense
  const [prevYear, prevMonth] = format(subMonths(new Date(activeMonth + '-01'), 1), 'yyyy-MM').split('-').map(Number);
  const prevMonthExpInCategory = transactions
    .filter(t => {
      const d = parseISO(t.date);
      return t.type === 'expense' && t.category === biggestExpense.category &&
        d.getMonth() === prevMonth - 1 && d.getFullYear() === prevYear;
    })
    .reduce((s, t) => s + Math.abs(t.amount), 0);
  const biggestChange = prevMonthExpInCategory > 0
    ? Math.round(((biggestExpense.totalAmount - prevMonthExpInCategory) / prevMonthExpInCategory) * 100)
    : 0;

  return (
    <section className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-4xl font-headline font-black tracking-tight text-white mb-1">
          AI <span className="text-[#a4ffb9]">Insights</span>
        </h1>
        <p className="text-slate-500 text-sm">Understand your financial patterns</p>
      </div>

      {/* Month Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {months.map((m) => (
          <button
            key={m.value}
            onClick={() => setActiveMonth(m.value)}
            className={clsx(
              'px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all',
              activeMonth === m.value
                ? 'bg-[#00fd87]/15 text-[#00fd87] border border-[#00fd87]/40'
                : 'bg-[#1e1f26] text-slate-400 hover:text-white border border-transparent'
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Biggest Expense */}
        <Card glowing onClick={() => setBiggestModal(true)} className="p-6 border-l-4 border-[#ff706f]">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-xl bg-[#ff706f]/10">
              <TrendingUp size={20} className="text-[#ff706f]" />
            </div>
            <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-1 rounded">🔥 Hot</span>
          </div>
          <h3 className="text-slate-400 text-[13px] font-medium mb-1">Biggest Expense</h3>
          <p className="text-2xl font-mono text-white mb-1">{biggestExpense.category}</p>
          <p className="text-sm text-slate-500">{formatCurrency(biggestExpense.totalAmount)}</p>
          <p className="text-xs text-[#ff706f] mt-4 flex items-center gap-1">View Details <ExternalLink size={12} /></p>
        </Card>

        {/* MoM Change */}
        <Card glowing onClick={() => setMomModal(true)} className="p-6 border-l-4 border-[#00fd87]">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-xl bg-[#00fd87]/10">
              {momChange.trend === 'up' ? <TrendingUp size={20} className="text-[#ff706f]" /> : <TrendingDown size={20} className="text-[#00fd87]" />}
            </div>
            <span className="text-[10px] font-mono text-[#00fd87] bg-[#00fd87]/10 px-2 py-1 rounded">📈 MoM</span>
          </div>
          <h3 className="text-slate-400 text-[13px] font-medium mb-1">MoM Change</h3>
          <p className="text-2xl font-mono text-white mb-1">{momChange.changePercent >= 0 ? '+' : ''}{momChange.changePercent}%</p>
          <p className="text-sm text-slate-500">vs last month</p>
          <p className="text-xs text-[#00fd87] mt-4 flex items-center gap-1">View Details <ExternalLink size={12} /></p>
        </Card>

        {/* Top Category */}
        <Card glowing onClick={() => setTopModal(true)} className="p-6 border-l-4 border-[#5bb1ff]">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-xl bg-[#5bb1ff]/10">
              <Target size={20} className="text-[#5bb1ff]" />
            </div>
            <span className="text-[10px] font-mono text-[#5bb1ff] bg-[#5bb1ff]/10 px-2 py-1 rounded">🏆 #1</span>
          </div>
          <h3 className="text-slate-400 text-[13px] font-medium mb-1">Top Category</h3>
          <p className="text-2xl font-mono text-white mb-1">{topCategory.name}</p>
          <p className="text-sm text-slate-500">{topCategory.count} transactions</p>
          <p className="text-xs text-[#5bb1ff] mt-4 flex items-center gap-1">View Details <ExternalLink size={12} /></p>
        </Card>
      </div>

      {/* AI Deep Dive Toggle */}
      <div>
        <button
          onClick={() => setDeepDiveOpen(!deepDiveOpen)}
          className={clsx(
            'w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all',
            'bg-[#181920]/70 border border-white/5 hover:border-[#00fd87]/20',
            deepDiveOpen && 'border-[#00fd87]/30'
          )}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <Sparkles size={20} className="text-[#a4ffb9]" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#00fd87] rounded-full animate-pulse" />
            </div>
            <span className="font-headline font-bold text-white">🤖 AI Deep Dive Analysis</span>
          </div>
          {deepDiveOpen ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
        </button>

        <div
          className={clsx(
            'overflow-hidden transition-all duration-500 ease-in-out',
            deepDiveOpen ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0'
          )}
        >
          {/* Deep Dive Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Flow', value: formatCurrency(deepDive.totalFlow), color: '#5bb1ff' },
              { label: 'Net Savings', value: formatCurrency(deepDive.netSavings), color: deepDive.netSavings >= 0 ? '#00fd87' : '#ff706f' },
              { label: 'Daily Burn Rate', value: formatCurrency(deepDive.burnRate), color: '#f59e0b' },
              { label: 'Projected Balance', value: formatCurrency(deepDive.projectedBalance), color: deepDive.projectedBalance >= 0 ? '#00fd87' : '#ff706f' },
            ].map(stat => (
              <Card key={stat.label} className="p-4">
                <p className="text-[10px] font-label uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
                <p className="text-xl font-mono font-medium" style={{ color: stat.color }}>{stat.value}</p>
              </Card>
            ))}
          </div>

          {/* Flow Chart */}
          <Card className="p-6 mb-6">
            <h3 className="font-headline font-bold text-white mb-4">Flow Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={deepDive.dailyFlow}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="#75757c" fontSize={10} fontFamily="DM Mono" />
                <YAxis stroke="#75757c" fontSize={10} fontFamily="DM Mono" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: '#1a1c24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px', fontFamily: 'DM Mono' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'DM Mono' }} />
                <Bar dataKey="expense" fill="#ff706f" opacity={0.6} name="Expense" radius={[2, 2, 0, 0]} />
                <Bar dataKey="income" fill="#00fd87" opacity={0.6} name="Income" radius={[2, 2, 0, 0]} />
                <Line type="monotone" dataKey="cumulative" stroke="#5bb1ff" strokeWidth={2} dot={false} name="Cumulative" />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>

          {/* Category Budget Table */}
          <Card className="overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-white/5">
              <h3 className="font-headline font-bold text-white">Category Budget Tracker</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-6 py-3 text-left text-[10px] font-label uppercase tracking-widest text-slate-500">Category</th>
                    <th className="px-4 py-3 text-right text-[10px] font-label uppercase tracking-widest text-slate-500">Budget</th>
                    <th className="px-4 py-3 text-right text-[10px] font-label uppercase tracking-widest text-slate-500">Actual</th>
                    <th className="px-4 py-3 text-right text-[10px] font-label uppercase tracking-widest text-slate-500">Variance</th>
                    <th className="px-4 py-3 text-center text-[10px] font-label uppercase tracking-widest text-slate-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {deepDive.categoryBudgetMap.map(row => (
                    <tr key={row.category} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                      <td className="px-6 py-3 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: CATEGORY_COLORS[row.category as Category] }} />
                        <span className="text-white">{row.category}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-slate-400">
                        {budgetEditing === row.category ? (
                          <div className="flex items-center gap-1 justify-end">
                            <input
                              type="number"
                              value={budgetValue}
                              onChange={(e) => setBudgetValue(e.target.value)}
                              className="w-20 bg-[#24252d] border border-white/10 rounded px-2 py-1 text-xs text-white text-right"
                              autoFocus
                            />
                            <button onClick={() => saveBudget(row.category)} className="text-[#00fd87] text-xs font-bold">✓</button>
                          </div>
                        ) : (
                          <button onClick={() => { setBudgetEditing(row.category); setBudgetValue(row.budget.toString()); }} className="hover:text-white">
                            {formatCurrency(row.budget)}
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-white">{formatCurrency(row.actual)}</td>
                      <td className={clsx('px-4 py-3 text-right font-mono', row.variance >= 0 ? 'text-[#00fd87]' : 'text-[#ff706f]')}>
                        {row.variance >= 0 ? '+' : ''}{formatCurrency(row.variance)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge
                          color={row.status === 'over' ? '#ff706f' : row.status === 'on_track' ? '#f59e0b' : '#00fd87'}
                        >
                          {row.status === 'over' ? 'Over' : row.status === 'on_track' ? 'On Track' : 'Under'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Key Observations */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb size={18} className="text-[#f59e0b]" />
              <h3 className="font-headline font-bold text-white">Key Observations</h3>
            </div>
            <div className="space-y-3">
              {deepDive.keyObservations.map((obs, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl bg-white/[0.02]">
                  <span className="text-[#a4ffb9] font-mono text-xs shrink-0 mt-0.5">0{i + 1}</span>
                  <p className="text-sm text-slate-300">{obs}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* ===== MODALS ===== */}

      {/* Biggest Expense Modal */}
      <Modal isOpen={biggestModal} onClose={() => setBiggestModal(false)} title="Biggest Expense This Month" titleIcon="🔥">
        <div className="p-6 space-y-6">
          <div className="text-center">
            <p className="text-[#5bb1ff] font-headline font-bold text-xl mb-1">{biggestExpense.category}</p>
            <p className="text-4xl font-mono font-bold text-[#ff706f]">{formatCurrency(biggestExpense.totalAmount)}</p>
            <p className="text-sm text-slate-400 mt-2">{biggestExpense.percentage}% of your total expenses</p>
          </div>
          <div className="h-3 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#ff706f] to-[#ff706f]/50 rounded-full transition-all" style={{ width: `${biggestExpense.percentage}%` }} />
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-label uppercase tracking-widest text-slate-500">Top Transactions</h4>
            {biggestExpense.transactions.map(tx => (
              <div key={tx.id} className="flex justify-between items-center py-2.5 px-3 rounded-xl hover:bg-white/[0.02]">
                <div>
                  <p className="text-sm font-bold text-white">{tx.merchant}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{format(parseISO(tx.date), 'dd MMM yyyy')}</p>
                </div>
                <span className="font-mono text-sm text-[#ff706f]">-{formatCurrency(tx.amount)}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/[0.02]">
            <span className="text-sm text-slate-400">vs Last Month</span>
            <span className={clsx('font-mono text-sm font-bold flex items-center gap-1', biggestChange >= 0 ? 'text-[#ff706f]' : 'text-[#00fd87]')}>
              {biggestChange >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {biggestChange >= 0 ? '+' : ''}{biggestChange}%
            </span>
          </div>
          <div className="p-4 rounded-xl bg-[#f59e0b]/5 border border-[#f59e0b]/20">
            <p className="text-sm text-slate-300">
              <span className="text-[#f59e0b] font-bold">💡 Tip: </span>
              Consider setting a {formatCurrency(biggestExpense.totalAmount * 0.8)} monthly cap for {biggestExpense.category}. You&apos;ve been spending consistently in this area.
            </p>
          </div>
        </div>
      </Modal>

      {/* MoM Change Modal */}
      <Modal isOpen={momModal} onClose={() => setMomModal(false)} title="Month-over-Month Comparison" titleIcon="📈">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/[0.02] text-center">
              <p className="text-[10px] font-label uppercase tracking-widest text-slate-500 mb-2">This Month</p>
              <p className="text-2xl font-mono font-bold text-white">{formatCurrency(momChange.current)}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] text-center">
              <p className="text-[10px] font-label uppercase tracking-widest text-slate-500 mb-2">Last Month</p>
              <p className="text-2xl font-mono font-bold text-slate-400">{formatCurrency(momChange.previous)}</p>
            </div>
          </div>
          <div className="text-center py-2">
            <span className={clsx(
              'text-4xl font-mono font-bold',
              momChange.trend === 'up' ? 'text-[#ff706f]' : 'text-[#00fd87]'
            )}>
              {momChange.changePercent >= 0 ? '+' : ''}{momChange.changePercent}%
            </span>
            <p className="text-sm text-slate-500 mt-1">
              {momChange.trend === 'up' ? 'Spending increased' : 'Spending decreased'}
            </p>
          </div>
          <div>
            <h4 className="text-xs font-label uppercase tracking-widest text-slate-500 mb-4">Category Comparison</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={momChange.categoryBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="category" stroke="#75757c" fontSize={9} fontFamily="DM Mono" angle={-15} textAnchor="end" height={50} />
                <YAxis stroke="#75757c" fontSize={10} fontFamily="DM Mono" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: '#1a1c24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px' }} formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="current" fill="#5bb1ff" name="Current" radius={[4, 4, 0, 0]} />
                <Bar dataKey="previous" fill="#47474e" name="Previous" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-slate-400">
            You spent {momChange.changePercent >= 0 ? `${momChange.changePercent}% more` : `${Math.abs(momChange.changePercent)}% less`} this month.
            {momChange.categoryBreakdown[0] && (
              <> Your biggest category was <span className="text-white font-bold">{momChange.categoryBreakdown[0].category}</span> at {formatCurrency(momChange.categoryBreakdown[0].current)}.</>
            )}
          </p>
        </div>
      </Modal>

      {/* Top Category Modal */}
      <Modal isOpen={topModal} onClose={() => setTopModal(false)} title="Top Spending Category" titleIcon="🏆">
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-xl" style={{ backgroundColor: `${CATEGORY_COLORS[topCategory.name as Category]}15` }}>
              <Target size={24} style={{ color: CATEGORY_COLORS[topCategory.name as Category] }} />
            </div>
            <div>
              <h3 className="text-2xl font-headline font-bold text-white">{topCategory.name}</h3>
              <p className="text-sm text-slate-500">Top spending this month</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total Spend', value: formatCurrency(topCategory.totalSpend) },
              { label: 'Transactions', value: topCategory.count.toString() },
              { label: 'Avg/Transaction', value: formatCurrency(topCategory.avgAmount) },
            ].map(stat => (
              <div key={stat.label} className="p-3 rounded-xl bg-white/[0.02] text-center">
                <p className="text-[10px] font-label uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
                <p className="text-lg font-mono font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
          <div>
            <h4 className="text-xs font-label uppercase tracking-widest text-slate-500 mb-4">6-Month Trend</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topCategory.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#75757c" fontSize={10} fontFamily="DM Mono" />
                <YAxis stroke="#75757c" fontSize={10} fontFamily="DM Mono" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: '#1a1c24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px' }} formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="amount" fill={CATEGORY_COLORS[topCategory.name as Category] || '#5bb1ff'} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Modal>
    </section>
  );
}
